import { Course } from '@/app/@types/models';
import {create} from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// interface Course {
//   id: string;
//   title: string;
//   description: string;
//   categoryId: string;
//   // ... (other course properties)
// }

interface CourseState {
  courses: Course[];
  selectedCourseId: string | null;
  addCourse: (course: Course) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (courseId: string) => void;
  setSelectedCourse: (courseId: string | null) => void;
}

export const useCourseStore = create(
  persist<CourseState>(
    (set) => ({
      courses: [],
      selectedCourseId: null,

      addCourse: (course) =>
        set((state) => ({ courses: [...state.courses, course] })),

      updateCourse: (course) =>
        set((state) => ({
          courses: state.courses.map((c) => (c.id === course.id ? course : c)),
        })),

      deleteCourse: (courseId) =>
        set((state) => ({
          courses: state.courses.filter((c) => c.id !== courseId),
        })),

      setSelectedCourse: (courseId) => set({ selectedCourseId: courseId }),
    }),
    {
      name: 'course-state', // Specify a storage name
      storage: createJSONStorage(() => sessionStorage), // Choose storage backend (IndexedDB, LocalStorage, etc.)
    }
  )
);
