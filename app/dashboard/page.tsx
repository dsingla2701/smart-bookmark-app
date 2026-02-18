"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import BookmarkCard from "@/components/BookmarkCard";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ AUTH + INITIAL FETCH (Stable on refresh)
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      if (!data.session) {
        setLoading(false);
        window.location.href = "/";
        return;
      }

      setUser(data.session.user);

      const { data: bookmarksData } = await supabase
        .from("bookmarks")
        .select("*")
        .order("created_at", { ascending: false });

      setBookmarks(bookmarksData || []);
      setLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      if (!session) {
        window.location.href = "/";
      } else {
        setUser(session.user);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ✅ REALTIME SUBSCRIPTION
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setBookmarks((prev) => [
            payload.new as any,
            ...prev,
          ]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setBookmarks((prev) =>
            prev.map((b) =>
              b.id === payload.new.id ? payload.new : b
            )
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setBookmarks((prev) =>
            prev.filter((b) => b.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // ✅ ADD BOOKMARK
  const addBookmark = async () => {
    if (!url) return;

    let formattedUrl = url;

    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://")
    ) {
      formattedUrl = "https://" + formattedUrl;
    }

    try {
      new URL(formattedUrl);
    } catch {
      toast.error("Invalid URL");
      return;
    }

    const { error } = await supabase.from("bookmarks").insert([
      {
        title: title || new URL(formattedUrl).hostname,
        url: formattedUrl,
        user_id: user.id,
      },
    ]);

    if (error) {
      toast.error("Failed to add bookmark");
    } else {
      toast.success("Bookmark added");
    }

    setTitle("");
    setUrl("");
  };

  // ✅ DELETE BOOKMARK
  const deleteBookmark = async (id: string) => {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Delete failed");
    } else {
      toast("Bookmark deleted", { icon: "🗑️" });
    }
  };

  // ✅ LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // ✅ LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f11]">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white px-6 py-16 flex justify-center">
      <div className="w-full max-w-3xl space-y-10">

        <Navbar count={bookmarks.length} logout={logout} />

        {/* Add Bookmark */}
        <div className="space-y-3">
          <input
            className="w-full bg-[#1a1a1d] border border-[#2a2a2e] p-4 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:border-white transition"
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addBookmark();
            }}
          />

          <div className="flex gap-3">
            <input
              className="flex-1 bg-[#1a1a1d] border border-[#2a2a2e] p-4 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:border-white transition"
              placeholder="Paste URL and press Enter..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addBookmark();
              }}
            />

            <button
              onClick={addBookmark}
              className="bg-white text-black px-6 rounded-xl text-sm font-medium hover:opacity-90 transition"
            >
              Add
            </button>
          </div>
        </div>

        {bookmarks.length === 0 && (
          <div className="text-center text-gray-500 py-16">
            No bookmarks yet.
          </div>
        )}

        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onDelete={deleteBookmark}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
