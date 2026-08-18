import * as React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { clearProjectStorage } from '../utils/storage';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = async () => {
    try {
      await clearProjectStorage();
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900 border border-rose-800/60 rounded-2xl p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-950 border border-rose-800 mx-auto flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white">Application Recovery Mode</h2>
              <p className="text-xs text-slate-400">
                An unexpected state error was intercepted: {this.state.error?.message || 'Unknown runtime error'}
              </p>
            </div>
            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset State & Reload Review Workspace</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

