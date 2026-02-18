"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

export default function BookmarkCard({ bookmark, onDelete }: any) {
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(bookmark.title);
  const [newUrl, setNewUrl] = useState(bookmark.url);

  let domain = "";

  try {
    const formattedUrl = bookmark.url.startsWith("http")
      ? bookmark.url
      : "https://" + bookmark.url;

    domain = new URL(formattedUrl).hostname;
  } catch {
    domain = "";
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bookmark.url);
    toast.success("Copied to clipboard!");
  };

  const updateBookmark = async () => {
    let formattedUrl = newUrl;

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

    const { error } = await supabase
      .from("bookmarks")
      .update({
        title: newTitle,
        url: formattedUrl,
      })
      .eq("id", bookmark.id);

    if (error) {
      toast.error("Update failed");
    } else {
      toast.success("Bookmark updated");
      setEditing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="group bg-[#151517] border border-[#26262b] rounded-2xl p-5 transition-all duration-200"
    >
      {editing ? (
        <div className="space-y-3">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-[#1a1a1d] border border-[#2a2a2e] p-3 rounded-xl text-sm"
          />

          <input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="w-full bg-[#1a1a1d] border border-[#2a2a2e] p-3 rounded-xl text-sm"
          />

          <div className="flex gap-3">
            <button
              onClick={updateBookmark}
              className="bg-white text-black px-4 py-2 rounded-xl text-sm"
            >
              Save
            </button>

            <button
              onClick={() => setEditing(false)}
              className="text-gray-400 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {domain && (
              <img
                src={`https://www.google.com/s2/favicons?domain=${domain}`}
                alt="favicon"
                className="w-5 h-5"
              />
            )}

            <div>
              <a
                href={bookmark.url}
                target="_blank"
                className="font-medium text-white group-hover:underline"
              >
                {bookmark.title}
              </a>

              <p className="text-xs text-gray-500 mt-1">
                {bookmark.url}
              </p>
            </div>
          </div>

          <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={copyToClipboard}
              className="text-gray-400 hover:text-white text-sm"
            >
              Copy
            </button>

            <button
              onClick={() => setEditing(true)}
              className="text-gray-400 hover:text-white text-sm"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(bookmark.id)}
              className="text-red-500 hover:text-red-400 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
