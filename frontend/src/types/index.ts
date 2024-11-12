export interface User {
    _id: string;
    username: string;
    email: string;
    createdAt: string;
}

export interface Post {
    _id: string;
    title: string;
    content: string;
    author: User;
    community: Community;
    createdAt: string;
    votes: number;
}

export interface Community {
    _id: string;
    name: string;
    description: string;
    creator: User;
    createdAt: string;
    members: number;
}
