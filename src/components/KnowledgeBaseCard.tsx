
import React, { useState, useRef } from "react";
import { 
  BookOpen, Upload, CircleDashed, ArrowRight, File, Database,
  Eye, Download, Trash2, ChevronUp, CheckCircle2, BarChart, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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

  return (
    <div className="rounded-lg overflow-hidden mb-6 border border-gray-200 dark:border-gray-800">
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 w-8 h-8 text-gray-900 dark:text-white">
              2
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
                  <Button className="gap-2 bg-primary">
                    <File className="h-4 w-4" />
                    Add Web Page
                  </Button>
                </div>
              </div>
            )}

            {status === 'in-progress' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg border border-gray-200 dark:border-gray-800/50 flex flex-col">
                    <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                      <FileText className="h-4 w-4" />
                      <span className="text-xs font-medium">Documents Processed</span>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{processedCount}/{totalCount}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Documents uploaded</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg border border-gray-200 dark:border-gray-800/50 flex flex-col">
                    <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                      <BarChart className="h-4 w-4" />
                      <span className="text-xs font-medium">Processing Status</span>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{Math.round((processedCount / totalCount) * 100)}%</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Current progress</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg border border-gray-200 dark:border-gray-800/50 flex flex-col">
                    <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                      <Database className="h-4 w-4" />
                      <span className="text-xs font-medium">Knowledge Sources</span>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{documents.length}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Total sources</div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-full">
                      <ArrowRight className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1 text-gray-900 dark:text-white">Progress: {processedCount} of {totalCount} documents processed</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Upload {totalCount - processedCount} more documents to complete your knowledge base.</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Uploaded Knowledge</h4>
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div key={doc.id} className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                            <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-white">{doc.title}</h5>
                            <p className="text-xs text-gray-500 dark:text-gray-500">{doc.format} • {doc.size} • {doc.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {(status === 'in-progress' || status === 'not-started') && (
              <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg mb-6 border border-gray-200 dark:border-gray-800">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Add Knowledge Sources</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Select a method to provide training data for your agent:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button variant="outline" className="flex items-center justify-center gap-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                    <File className="h-4 w-4" />
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
                  <Button variant="outline" className="flex items-center justify-center gap-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                    <CircleDashed className="h-4 w-4" />
                    <span>Add Text</span>
                  </Button>
                </div>
              </div>
            )}

            {status === 'completed' && (
              <div className="mb-6">
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1 text-gray-900 dark:text-white">Completed: Knowledge base ready</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">All uploaded documents have been processed and are ready for your agent.</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg border border-gray-200 dark:border-gray-800/50 flex flex-col">
                    <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                      <FileText className="h-4 w-4" />
                      <span className="text-xs font-medium">Documents Processed</span>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{totalCount}/{totalCount}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Documents uploaded</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg border border-gray-200 dark:border-gray-800/50 flex flex-col">
                    <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                      <BarChart className="h-4 w-4" />
                      <span className="text-xs font-medium">Processing Status</span>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">100%</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Complete</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg border border-gray-200 dark:border-gray-800/50 flex flex-col">
                    <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                      <Database className="h-4 w-4" />
                      <span className="text-xs font-medium">Knowledge Sources</span>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{documents.length}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Total sources</div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Uploaded Knowledge</h4>
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div key={doc.id} className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                            <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-white">{doc.title}</h5>
                            <p className="text-xs text-gray-500 dark:text-gray-500">{doc.format} • {doc.size} • {doc.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
