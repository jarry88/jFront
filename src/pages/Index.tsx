import { LoginForm } from "@/components/LoginForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header with branding */}
      <header className="w-full py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="https://cdn.builder.io/api/v1/assets/566304424392498fb70956fc16b27686/janus-logo-source-file-01-950bb6?format=webp&width=800"
              alt="Janus Logo"
              className="w-8 h-8 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">Janus</h1>
              <p className="text-xs text-muted-foreground">
                Back-office operations for freight forwarders
              </p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Need help?{" "}
            <span className="text-primary font-medium">Contact Support</span>
          </div>
        </div>
      </header>

      {/* Main login content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-white/20 p-8">
            <LoginForm />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-6">
            <span>© 2025 Janus</span>
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <span>Version 2.1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
