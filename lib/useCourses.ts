"use client";

import { useEffect, useState } from "react";
import { getCourses } from "@/lib/content";
import type { Course } from "@/lib/types";

/** Client-side hook: live course list from Firestore (empty until loaded). */
export function useCourses(): Course[] {
  const [courses, setCourses] = useState<Course[]>([]);
  useEffect(() => {
    let cancelled = false;
    getCourses().then((c) => {
      if (!cancelled) setCourses(c);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return courses;
}
