import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <main className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Hachimi Blog Admin</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/users"
            className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">User Management</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage blog users. Each user gets their own GitHub repository.
            </p>
          </Link>

          <Link
            href="/blogs"
            className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">Blog Management</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage blog posts and repositories connected to GitHub.
            </p>
          </Link>

          <Link
            href="/editor"
            className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">Blog Editor</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Write and edit blog posts with markdown support.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
