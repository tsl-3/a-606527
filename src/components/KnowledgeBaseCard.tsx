import React, { useState, useRef } from "react";
import { 
  BookOpen, Upload, CircleDashed, ArrowRight, File, Database,
  Eye, Download, Trash2, ChevronUp, CheckCircle2, BarChart, FileText,
  Globe, Type
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Define document interface
interface Document {
  id: string;
  title: string;
  type: string;
  size: string;
  date: string;
  format?: string;
}

interface KnowledgeBaseCardProps {
  status: 'not-started' | 'in-progress' | 'completed';
  documents?: Document[];
  processedCount?: number;
  totalCount?: number;
}

export const KnowledgeBaseCard: React.FC<KnowledgeBaseCardProps> = ({ 
  status, 
  documents = [], 
  processedCount = 0,
  totalCount = 10
}) => {
  const [isExpanded, setIsExpanded] = useState(status !== 'completed');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [webUrlDialogOpen, setWebUrlDialogOpen] = useState(false);
  const [textDialogOpen, setTextDialogOpen] = useState(false);
  const [webUrl, setWebUrl] = useState("");
  const [webUrls, setWebUrls] = useState<string[]>([]);
  const [knowledgeText, setKnowledgeText] = useState("");

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log('Files selected:', files);
      // Here you would handle file upload logic in a real app
    }
  };

  const handleAddWebUrl = () => {
    if (webUrl.trim()) {
      setWebUrls([...webUrls, webUrl]);
      setWebUrl(""); // Clear the input for next entry
    }
  };

  const handleAddText = () => {
    if (knowledgeText.trim()) {
      console.log('Text added:', knowledgeText);
      // Here you would handle saving the text in a real app
      setTextDialogOpen(false);
      setKnowledgeText("");
    }
  };

  return (
    <div className="rounded-lg overflow-hidden mb-6 border border-gray-200 dark:border-gray-800">
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 w-8 h-8 text-gray-900 dark:text-white">
              1
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Knowledge Base</h3>
            {status === 'in-progress' && (
              <Badge variant="outline" className="bg-amber-500/20 text-amber-500 dark:text-amber-400 border-amber-500/30 ml-2">
                In Progress
              </Badge>
            )}
            {status === 'completed' && (
              <Badge variant="outline" className="bg-green-500/20 text-green-500 dark:text-green-400 border-green-500/30 ml-2">
                Completed
              </Badge>
            )}
            {status === 'not-started' && (
              <Badge variant="outline" className="bg-gray-500/20 text-gray-500 dark:text-gray-400 border-gray-500/30 ml-2">
                Not Started
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {status === 'in-progress' && <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round((processedCount / totalCount) * 100)}%</span>}
            {status === 'completed' && <span className="text-sm text-gray-500 dark:text-gray-400">100%</span>}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
            >
              <ChevronUp className={`h-5 w-5 ${!isExpanded ? 'transform rotate-180' : ''}`} />
            </Button>
          </div>
        </div>
        
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Add knowledge to your agent by uploading documents or providing text
        </p>
        
        {status !== 'not-started' && (
          <Progress 
            value={status === 'completed' ? 100 : Math.round((processedCount / totalCount) * 100)} 
            className="h-1.5 mb-6" 
          />
        )}
        
        {isExpanded && (
          <>
            {status === 'not-started' && (
              <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800 rounded-lg p-8 mb-8 text-center">
                <Database className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">No knowledge sources yet</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Upload documents, add web pages, or provide text to begin building your agent's knowledge base.
                </p>
                <div className="flex justify-center gap-4">
                  <Button 
                    variant="outline" 
                    className="border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white gap-2"
                    onClick={handleUploadClick}
                  >
                    <Upload className="h-4 w-4" />
                    Upload Documents
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                  />
                  <Button 
                    className="gap-2 bg-primary"
                    onClick={() => setWebUrlDialogOpen(true)}
                  >
                    <Globe className="h-4 w-4" />
                    Add Web Page
                  </Button>
                  <Button 
                    variant="outline" 
                    className="gap-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white"
                    onClick={() => setTextDialogOpen(true)}
                  >
                    <Type className="h-4 w-4" />
                    Add Text
                  </Button>
                </div>
              </div>
            )}

            {status === 'in-progress' && (
              // ... keep existing code (in-progress state UI)
            )}

            {status === 'completed' && (
              // ... keep existing code (completed state UI)
            )}

            {(status === 'in-progress' || status === 'completed') && (
              <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg mb-6 border border-gray-200 dark:border-gray-800">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Add Knowledge Sources</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Select a method to provide training data for your agent:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center gap-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setWebUrlDialogOpen(true)}
                  >
                    <Globe className="h-4 w-4" />
                    <span>Add Web Page</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center gap-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={handleUploadClick}
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload Documents</span>
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                  />
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center gap-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setTextDialogOpen(true)}
                  >
                    <Type className="h-4 w-4" />
                    <span>Add Text</span>
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Web Page Dialog */}
      <Dialog open={webUrlDialogOpen} onOpenChange={setWebUrlDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Web Page</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Enter URL (e.g., https://example.com)" 
                value={webUrl} 
                onChange={(e) => setWebUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddWebUrl}>Add</Button>
            </div>
            
            {webUrls.length > 0 && (
              <div className="border rounded-md p-3 space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  URLs to add ({webUrls.length})
                </h4>
                <div className="space-y-2">
                  {webUrls.map((url, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-2 rounded-md">
                      <span className="text-sm truncate max-w-[250px]">{url}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0" 
                        onClick={() => setWebUrls(webUrls.filter((_, i) => i !== index))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                setWebUrlDialogOpen(false);
                setWebUrl("");
                setWebUrls([]);
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={() => {
                console.log('Web URLs added:', webUrls);
                setWebUrlDialogOpen(false);
                setWebUrl("");
                // Keep the list for demonstration, in a real app you'd process them
              }}
              disabled={webUrls.length === 0}
            >
              Add Web Pages
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Text Dialog */}
      <Dialog open={textDialogOpen} onOpenChange={setTextDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Text Knowledge</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea 
              placeholder="Enter text that will be used as knowledge for your agent..." 
              value={knowledgeText} 
              onChange={(e) => setKnowledgeText(e.target.value)}
              className="min-h-[200px]"
            />
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                setTextDialogOpen(false);
                setKnowledgeText("");
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleAddText}
              disabled={knowledgeText.trim().length === 0}
            >
              Add Text
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
