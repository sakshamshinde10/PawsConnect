# Happy Paws Connect 🐾

Happy Paws Connect is a comprehensive platform designed to bridge the gap between pet owners, pet service providers, and people looking to adopt a pet. Built with a modern, high-performance tech stack, it provides seamless pet listings, a full adoption workflow, service provider registration, and real-time notifications.

## Features ✨

- **Pet Adoption:** Browse available pets with an intuitive UI, filter by breed, and connect directly with existing owners or shelters.
- **Service Providers:** Register as a pet service provider (e.g., dog walking, grooming, sitting). Includes a comprehensive admin approval workflow.
- **Booking System:** Book services with real-time status updates and automated notifications.
- **Real-time Notifications:** Keep pet owners and service providers informed about booking and adoption statuses instantly.
- **Responsive UI:** Beautiful, responsive, and accessible design.

## Tech Stack 🛠️

- **Frontend Framework:** React 18, TypeScript, Vite
- **Styling & UI:** Tailwind CSS, shadcn/ui, Radix UI Primitives
- **State Management:** TanStack React Query (`@tanstack/react-query`)
- **Backend & Database:** Supabase (`@supabase/supabase-js`)
- **Routing:** React Router (`react-router-dom`)
- **Forms & Validation:** React Hook Form + Zod

## Getting Started 🚀

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) and npm installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/happy-paws-connect.git
   cd happy-paws-connect
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add your Supabase credentials and other necessary environment variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173` to see the application running.

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production to the `dist` folder.
- `npm run lint`: Runs ESLint to catch syntax and style issues.
- `npm run test`: Runs the Vitest test suite.
- `npm run preview`: Locally preview the production build.

## Contributing 🤝

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
