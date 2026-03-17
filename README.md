# Hachimi Blog Admin

Admin system for managing the Hachimi Blog infrastructure. This system provides:

1. **User Management** - Create and manage blog users with automatic GitHub repository creation
2. **Blog Management** - Interface with GitHub repositories to manage blog posts
3. **Blog Editor** - Simple markdown editor for writing blog posts

## Features

### User Management
- Create new users
- Automatically provision GitHub repositories via Terraform
- Set up Cloudflare Pages for blog deployment
- List and delete users

### Blog Management
- View all blog posts or filter by user
- Publish/unpublish posts
- Edit and delete posts
- Automatic synchronization with GitHub repositories

### Blog Editor
- Markdown support with live preview
- Auto-generate slugs from titles
- Direct push to GitHub repositories
- Draft and publish modes

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- GitHub Personal Access Token with repo permissions
- (Optional) Terraform CLI for actual infrastructure provisioning
- (Optional) Cloudflare API token for Pages deployment

### Installation

1. Clone the repository:
```bash
git clone https://github.com/JetSquirrel/HachimiBlogAdmin.git
cd HachimiBlogAdmin
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
- `GITHUB_TOKEN`: Your GitHub personal access token
- `GITHUB_ORG`: GitHub organization name (default: HachimiTech)
- `REPO_PREFIX`: Prefix for created repositories (default: hachimi)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture

### Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Infrastructure**: Terraform (for GitHub repo and Cloudflare Pages provisioning)
- **APIs**: GitHub REST API

### Project Structure

```
/app
  /api
    /users          # User management API endpoints
    /blogs          # Blog management API endpoints
  /users            # User management UI
  /blogs            # Blog management UI
  /editor           # Blog editor UI
  layout.tsx        # Root layout
  page.tsx          # Home page
/lib
  database.ts       # In-memory database operations
  github.ts         # GitHub API integration
  terraform.ts      # Terraform integration
/types
  index.ts          # TypeScript type definitions
```

### Data Flow

1. **User Creation**:
   - User fills out the creation form
   - System calls Terraform to create GitHub repository
   - System provisions Cloudflare Pages
   - User record saved to database with repo URLs

2. **Blog Post Creation**:
   - User writes post in markdown editor
   - Post saved to database
   - Content pushed to user's GitHub repository as markdown file
   - Cloudflare Pages automatically deploys changes

3. **Blog Post Management**:
   - List/filter posts from database
   - Publish/unpublish updates both database and GitHub
   - Delete removes from both database and GitHub

## API Endpoints

### Users

- `GET /api/users` - List all users
- `POST /api/users` - Create a new user
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Blogs

- `GET /api/blogs` - List all blog posts (optional ?userId filter)
- `POST /api/blogs` - Create a new blog post
- `GET /api/blogs/[id]` - Get blog post by ID
- `PUT /api/blogs/[id]` - Update blog post
- `DELETE /api/blogs/[id]` - Delete blog post

## Configuration

### GitHub Token Permissions

Your GitHub token needs the following permissions:
- `repo` - Full control of private repositories
- `admin:org` - Full control of orgs (if creating repos in an organization)

### Terraform Setup

The system includes Terraform configuration generation. For production use:

1. Install Terraform CLI
2. Configure GitHub and Cloudflare providers
3. Update the `TerraformService` to execute actual Terraform commands

## Development

### Running Locally

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Database

Currently uses in-memory storage for simplicity. For production, replace with:
- PostgreSQL
- MongoDB
- Supabase
- Firebase

## Security Considerations

1. **Authentication**: Add authentication (NextAuth.js, Auth0, etc.)
2. **Authorization**: Implement role-based access control
3. **API Rate Limiting**: Add rate limiting to API endpoints
4. **Input Validation**: Validate all user inputs
5. **Secret Management**: Use proper secret management (not .env in production)

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
docker build -t hachimi-blog-admin .
docker run -p 3000:3000 hachimi-blog-admin
```

## Roadmap

- [ ] Add authentication and authorization
- [ ] Replace in-memory database with persistent storage
- [ ] Add image upload support
- [ ] Implement actual Terraform execution
- [ ] Add webhook support for GitHub events
- [ ] Add analytics dashboard
- [ ] Support custom domains
- [ ] Add SEO management features

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.