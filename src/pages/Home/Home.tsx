import PostList from "../../components/Post/PostList";

export default function Home() {
    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="pt-2 sm:pt-4">
                <PostList />
            </div>
        </div>
    );
}
