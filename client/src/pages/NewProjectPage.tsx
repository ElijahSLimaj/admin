import { useState } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * Page where users start a new project by entering a prompt.
 * UI-only stub; replace createProject placeholder with real API call.
 */
export function NewProjectPage() {
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateProject = async () => {
    setIsSubmitting(true);
    try {
      // TODO: call your API (e.g., createProject({ prompt }))
      console.log('Creating project with prompt:', prompt);
      // placeholder: navigate to editor or show toast on success
    } catch (error) {
      console.error(error);
      // TODO: show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Prompt form */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Start your project</h2>
        <p className="text-muted-foreground">
          Start your first project by describing what you need.
        </p>

        <div className="relative">
          {/* Multiline prompt input */}
          <textarea
            className="w-full h-32 rounded-lg border border-input bg-background p-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Describe what you need..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          {/* Submit button */}
          <button
            className="absolute bottom-3 right-3 inline-flex items-center justify-center p-2 bg-primary rounded-full text-white shadow-lg hover:bg-primary/90 disabled:opacity-50"
            onClick={handleCreateProject}
            disabled={!prompt.trim() || isSubmitting}
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div> 
      </div>
    </div>
  );
}
