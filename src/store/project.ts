// types/project.ts

export const projectRoles = ["Member", "Contributor", "Moderator", "Owner"];


export interface InvitedUser {
    userId: string;
    username: string;
    email: string;
    role: string; // e.g., "owner", "collaborator"
    // joinedAt: Date;
  }


export interface Participants {
    userId: string;
    role: string;
    // joinedAt: Date;
    profilePicture: string;
    username: string;
    email: string;
}
  
  export interface JoinRequest {
    userId: string;
    username: string;
    message: string;
    profilePicture: string;
    email: string;
    // requestedAt: Date;
    status: string; // "pending", "accepted", "rejected"
  }
  
  export interface Task {
    id: string;
    title: string;
    description: string;
    status: string; // "todo", "in_progress", "done", "archived", "blocked"
    priority: string; // "low", "medium", "high", "critical"
    assignedTo: Participants[];
    dueDate: Date;
    // createdAt: Date;
    // updatedAt: Date;
  }
  
  export interface Comment {
    userId: string;
    userName: string;
    content: string;
    // createdAt: Date;
  }
  
  export interface Attachment {
    fileName: string;
    url: string;
    // uploadedAt: Date;
  }
  
  export interface Feedback {
    userId: string;
    rating: number;
    comment: string;
    // createdAt: Date;
  }
  
  export interface Project {
    id: string;
    title: string;
    description: string;
    ownerId: string;
    ownerUsername: string;
    collaborationType: string; // "public" or "private"
    skillsNeeded: string[];
    industry: string;
    academicFields: string[];
    status: string; // "open", "in_progress", "completed", "archived"
    participants: Participants[];
    invitedUsers: InvitedUser[];
    joinRequests: JoinRequest[];
    tasks: Task[];
    progress: string; // e.g., "50%", "Milestone 2/4"
    comments: Comment[];
    chatRoomId: string;
    attachments: Attachment[];
    feedback: Feedback[];
    // createdAt: Date;
    // updatedAt: Date;
  }  