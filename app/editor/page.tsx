"use client";

import React from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Monitor, 
  ArrowLeft,
  Download
} from "lucide-react";
import Editor from '@/components/editor/Editor';

export default function EditorPage() {
  return (
    <div className="flex h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only md:not-sr-only md:inline-block">Back</span>
            </Link>
            <div className="flex items-center gap-2 font-bold">
              <Monitor className="h-5 w-5" />
              <span>ScreenCanvas Editor</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <div className="flex-1 overflow-hidden">
        <Editor />
      </div>
    </div>
  );
} 
