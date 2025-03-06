import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Bot, Upload, Plus, X, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { LoaderIcon } from "@/components/LoaderIcon";

const AGENT_TYPES = [
  {
    id: "customer-service",
    name: "Customer Service",
    description: "Help customers with inquiries, issues, and support requests."
  },
  {
    id: "sales",
    name: "Sales Assistant",
    description: "Guide customers through product options and purchase decisions."
  },
  {
    id: "knowledge-base",
    name: "Knowledge Base",
    description: "Answer questions based on your organization's documentation."
  },
  {
    id: "custom",
    name: "Custom Agent",
    description: "Design a specialized agent for your unique use case."
  }
];

const MODELS = [
  { id: "gpt-4", name: "GPT-4", description: "Most capable model, complex tasks" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Fast and efficient, general tasks" },
  { id: "claude-2", name: "Claude 2", description: "Anthropic's assistant, ethical responses" },
  { id: "llama-2", name: "Llama 2", description: "Open source model by Meta" }
];

const AgentCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [agentType, setAgentType] = useState("");
  const [model, setModel] = useState("");
  const [isPersonal, setIsPersonal] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!name.trim()) {
      newErrors.name = "Agent name is required";
    }
    
    if (!description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!agentType) {
      newErrors.agentType = "Please select an agent type";
    }
    
    if (!model) {
      newErrors.model = "Please select a model";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Agent Created!",
        description: `${name} has been successfully created.`,
      });
      setIsSubmitting(false);
      navigate("/agents");
    }, 1500);
  };
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <Link to="/agents" className="flex items-center text-gray-500 hover:text-agent-primary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Agents
        </Link>
      </div>
      
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-agent-primary/10 p-3 rounded-full">
          <Bot className="h-8 w-8 text-agent-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-agent-dark">Create New Agent</h1>
          <p className="text-gray-500 mt-1">Configure your agent's capabilities and behavior</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Define your agent's identity and purpose</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
                  Agent Name<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="E.g., Support Assistant, Sales Bot"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className={errors.description ? "text-destructive" : ""}>
                  Description<span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your agent does and how it can help users"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`min-h-[100px] ${errors.description ? "border-destructive" : ""}`}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>
              
              <div className="space-y-2">
                <Label className={errors.agentType ? "text-destructive" : ""}>
                  Agent Type<span className="text-destructive">*</span>
                </Label>
                <RadioGroup value={agentType} onValueChange={setAgentType} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {AGENT_TYPES.map((type) => (
                    <div key={type.id} className={`flex items-start space-x-3 border rounded-md p-4 transition-all hover:border-agent-primary/50 ${agentType === type.id ? "border-agent-primary bg-agent-secondary/50" : "border-gray-200"}`}>
                      <RadioGroupItem value={type.id} id={type.id} className="mt-1" />
                      <Label htmlFor={type.id} className="flex-1 cursor-pointer">
                        <span className="font-medium text-agent-dark">{type.name}</span>
                        <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.agentType && <p className="text-sm text-destructive">{errors.agentType}</p>}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Agent Configuration</CardTitle>
              <CardDescription>Select capabilities and access settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className={errors.model ? "text-destructive" : ""}>
                  AI Model<span className="text-destructive">*</span>
                </Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className={errors.model ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {MODELS.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        <div className="flex flex-col">
                          <span>{m.name}</span>
                          <span className="text-xs text-gray-500">{m.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.model && <p className="text-sm text-destructive">{errors.model}</p>}
              </div>
              
              <div className="space-y-2">
                <Label>Access Level</Label>
                <RadioGroup defaultValue="personal" value={isPersonal ? "personal" : "team"} onValueChange={(value) => setIsPersonal(value === "personal")}>
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="personal" id="personal" />
                      <Label htmlFor="personal">Personal (Only you can access)</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="team" id="team" />
                      <Label htmlFor="team">Team (All team members can access)</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Knowledge Base (Optional)</Label>
                <Alert className="bg-agent-secondary border-agent-primary/20">
                  <AlertCircle className="h-4 w-4 text-agent-primary" />
                  <AlertTitle>Train your agent</AlertTitle>
                  <AlertDescription>
                    Upload documents to help your agent learn your specific content and provide more accurate responses.
                  </AlertDescription>
                </Alert>
                
                <div className="mt-4">
                  <div className="border-2 border-dashed rounded-md border-gray-300 p-6 text-center hover:border-agent-primary/50 transition-all">
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto text-gray-400" />
                      <p className="mt-2 text-sm font-medium text-gray-600">Drag and drop files or click to browse</p>
                      <p className="mt-1 text-xs text-gray-500">PDF, DOCX, TXT, CSV (Max 10MB per file)</p>
                    </label>
                  </div>
                  
                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <Label>Uploaded Files</Label>
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 rounded p-2">
                            <div className="flex items-center space-x-2 text-sm">
                              <div className="bg-agent-primary/10 p-1 rounded">
                                <Bot className="h-4 w-4 text-agent-primary" />
                              </div>
                              <span>{file.name}</span>
                              <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => removeFile(index)}
                              className="h-6 w-6 rounded-full"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/agents")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                {isSubmitting ? (
                  <>
                    <LoaderIcon className="mr-2 h-4 w-4" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Agent
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default AgentCreate;
