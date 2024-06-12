// types/models.ts

export interface User {
  id?: number; // Using number since Prisma auto-increments IDs
  email: string;
  name?: string;
  password: string;
  courses?: CourseEnrollment[]; // Adding relations
  progress?: Progress[];
  createdAt?: Date; // Optional because they will be set by the database
  updatedAt?: Date;
}

export interface Course {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  
  imageUrl?: string;
  price?: number;
  isPublished?: boolean;
  categoryId?: string;
  attachments?: Attachment[];
  purchases?: Purchase[];
  units?: Unit[];
  enrollments?: CourseEnrollment[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Unit {
  id?: number;
  title: string;
  content: string;
  courseId: number; // Linking to Course
  chapters?: Chapter[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Chapter {
  id?: number;
  title: string;
  content: string;
  unitId: number; // Linking to Unit
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CourseEnrollment {
  id?: number;
  userId: number; // Linking to User
  courseId: number; // Linking to Course
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Progress {
  id?: number;
  userId: number; // Linking to User
  unitId: number; // Linking to Unit
  chapterId: number; // Linking to Chapter
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  id: string;
  name: string;
  courses?: Course[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  courseId: string;
  course: Course;
  createdAt: Date;
  updatedAt: Date;
}

export interface Purchase {
  id: string;
  userId: string;
  courseId: string;
  course: Course;
  createdAt: Date;
  updatedAt: Date;
}
