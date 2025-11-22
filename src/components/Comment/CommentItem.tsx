import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.locale("vi");

interface Comment {
    id: number;
    content: string;
    created_at: string;
    user: {
        id: string;
        username: string;
        avatar_url?: string;
    };
}

interface CommentItemProps {
    comment: Comment;
    currentUserId?: string;
    onDelete: (commentId: number) => void;
}

export default function CommentItem({ comment, currentUserId, onDelete }: CommentItemProps) {
    const [showMenu, setShowMenu] = useState(false);
    const timeAgo = dayjs.utc(comment.created_at).local().fromNow();
    const isOwner = currentUserId === comment.user.id;

    return (
        <div className="flex space-x-3 mb-3 mx-2 group">
            <img
                src={comment.user.avatar_url || "/default-avatar.png"}
                alt={comment.user.username}
                className="w-8 h-8 rounded-full border border-gray-300"
            />
            <div className="flex-1">
                <div className="bg-gray-100 rounded-2xl px-3 py-2 w-fit max-w-[90%] relative">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-gray-800">
                            {comment.user.username}
                        </span>
                        <span className="text-gray-500 text-xs">· {timeAgo}</span>
                    </div>
                    <p className="text-sm text-gray-800 mt-0.5 whitespace-pre-line">{comment.content}</p>

                    {/* Delete button for owner */}
                    {isOwner && (
                        <div className="absolute top-2 right-2">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-gray-200 rounded-full bg-transparent"
                            >
                                <i className="ri-more-line text-gray-600"></i>
                            </button>

                            {showMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowMenu(false)}
                                    />
                                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-20 w-32">
                                        <button
                                            onClick={() => {
                                                onDelete(comment.id);
                                                setShowMenu(false);
                                            }}
                                            className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition bg-white"
                                        >
                                            <i className="ri-delete-bin-line mr-2"></i> Xóa
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}