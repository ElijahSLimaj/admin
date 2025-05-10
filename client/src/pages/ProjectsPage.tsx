import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Edit, Link2, Copy, FilePlus, Trash, ExternalLink, Check, Users, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getUserProjects, deleteProjects, renameProject, getProjectAccess, updateProjectAccess } from "@/api/projects";
import { searchUsers } from "@/api/team";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { EmptyStateCard } from "@/components/ui/empty-state-card";

interface ProjectsPageProps {
  type?: 'drafts' | 'deployed';
}

export function ProjectsPage({ type = 'drafts' }: ProjectsPageProps) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [projectToRename, setProjectToRename] = useState<{ id: string, title: string } | null>(null);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  // Manage access state
  const [accessManagementOpen, setAccessManagementOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projectUsers, setProjectUsers] = useState<any[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userSearchResults, setUserSearchResults] = useState<any[]>([]);
  const [savingAccess, setSavingAccess] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  // Set page title based on type
  const pageTitle = type === 'drafts' ? 'Draft Projects' : 'Deployed Projects';

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getUserProjects(type);
        setProjects(response.projects);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fetch projects",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [toast, type]);

  const toggleProjectSelection = (projectId: string) => {
    if (selectedProjects.includes(projectId)) {
      setSelectedProjects(selectedProjects.filter(id => id !== projectId));
    } else {
      setSelectedProjects([...selectedProjects, projectId]);
    }
  };

  const handleSelectMode = () => {
    setIsSelecting(!isSelecting);
    setSelectedProjects([]);
  };

  const handleDeleteSelected = async () => {
    if (selectedProjects.length === 0) return;

    try {
      await deleteProjects({ projectIds: selectedProjects });

      // Update local state
      setProjects(projects.filter(project => !selectedProjects.includes(project._id)));

      toast({
        title: "Success",
        description: `Successfully deleted ${selectedProjects.length} project(s)`,
      });

      setSelectedProjects([]);
      setIsSelecting(false);
      setDeleteConfirmOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete projects",
      });
    }
  };

  const handleNewProject = () => {
    navigate("/projects/new");
  };

  const handleRename = async () => {
    if (!projectToRename || !newProjectTitle.trim()) return;

    setIsRenaming(true);
    try {
      const response = await renameProject(projectToRename.id, { title: newProjectTitle });

      // Update local state
      setProjects(projects.map(project =>
        project._id === projectToRename.id
          ? { ...project, title: newProjectTitle }
          : project
      ));

      toast({
        title: "Success",
        description: response.message || "Project renamed successfully",
      });

      setRenameDialogOpen(false);
      setProjectToRename(null);
      setNewProjectTitle("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to rename project",
      });
    } finally {
      setIsRenaming(false);
    }
  };

  const openAccessManagement = async (project: any) => {
    setSelectedProject(project);
    setAccessManagementOpen(true);
    setUserSearchQuery("");
    setUserSearchResults([]);

    try {
      const response = await getProjectAccess(project._id);
      setProjectUsers(response.users);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch project access",
      });
    }
  };

  const handleUserSearch = async (query: string) => {
    setUserSearchQuery(query);

    if (!query.trim()) {
      setUserSearchResults([]);
      return;
    }

    try {
      const response = await searchUsers(query);
      // Filter out users that are already in projectUsers
      const existingUserIds = projectUsers.map(p => p._id);
      setUserSearchResults(
        response.users.filter(user => !existingUserIds.includes(user._id))
      );
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to search users",
      });
    }
  };

  const addUserToProject = (user: any) => {
    // Add user to projectUsers with 'view' access as default
    setProjectUsers([...projectUsers, { ...user, access: 'view' }]);
    // Clear search results
    setUserSearchResults([]);
    setUserSearchQuery("");
  };

  const handleAccessChange = (userId: string, access: 'view' | 'edit') => {
    setProjectUsers(projectUsers.map(user =>
      user._id === userId ? { ...user, access } : user
    ));
  };

  const saveAccessChanges = async () => {
    if (!selectedProject) return;

    setSavingAccess(true);
    try {
      const usersToUpdate = projectUsers.map(u => ({
        id: u._id,
        access: u.access
      }));

      await updateProjectAccess(selectedProject._id, { users: usersToUpdate });

      toast({
        title: "Success",
        description: "Project access updated successfully",
      });
      setAccessManagementOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update project access",
      });
    } finally {
      setSavingAccess(false);
    }
  };

  const handleProjectAction = (action: string, projectId: string) => {
    const project = projects.find(p => p._id === projectId);

    if (!project) return;

    switch (action) {
      case 'open':
        window.open(`/editor/${projectId}`, '_blank');
        break;
      case 'copy-link':
        navigator.clipboard.writeText(`${window.location.origin}/p/${projectId}`);
        toast({
          title: "Link Copied",
          description: "Project link copied to clipboard",
        });
        break;
      case 'duplicate':
        toast({
          title: "Duplicating Project",
          description: "Creating a copy of your project...",
        });
        break;
      case 'rename':
        setProjectToRename({ id: projectId, title: project.title });
        setNewProjectTitle(project.title);
        setRenameDialogOpen(true);
        break;
      case 'unpublish':
        toast({
          title: "Feature Coming Soon",
          description: "Project unpublishing will be available shortly",
        });
        break;
      case 'manage-access':
        openAccessManagement(project);
        break;
      case 'delete':
        setSelectedProjects([projectId]);
        setDeleteConfirmOpen(true);
        break;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          <p className="text-muted-foreground">Manage your {type} projects</p>
        </div>
        <div className="flex gap-2">
          {isSelecting ? (
            <>
              <Button
                variant="outline"
                onClick={handleSelectMode}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={selectedProjects.length === 0}
                onClick={() => setDeleteConfirmOpen(true)}
              >
                Delete ({selectedProjects.length})
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleSelectMode}
              >
                Select
              </Button>
              <Button onClick={handleNewProject}>
                <FilePlus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.length === 0 ? (
          <div className="col-span-full flex justify-left">
          <EmptyStateCard
            title="No projects yet"
            description="Create your first project to get started."
            buttonText="Create Project"
            onButtonClick={handleNewProject}
          />
        </div>
        ) : (
          <>
            {projects.map((project) => (
              <Card
                key={project._id}
                className={`overflow-hidden transition-all ${
                  isSelecting ? "ring-2 ring-offset-2 " + (selectedProjects.includes(project._id) ? "ring-primary" : "ring-transparent") : ""
                }`}
                onClick={() => isSelecting && toggleProjectSelection(project._id)}
              >
                <div className="relative">
                  <div className="absolute top-2 right-2 z-10">
                    {!isSelecting && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full bg-background/80 backdrop-blur-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                          <DropdownMenuItem onClick={() => handleProjectAction("open", project._id)}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleProjectAction("copy-link", project._id)}>
                            <Link2 className="mr-2 h-4 w-4" />
                            Copy Link
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleProjectAction("duplicate", project._id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleProjectAction("rename", project._id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Rename
                          </DropdownMenuItem>
                          {type === 'deployed' && (
                            <DropdownMenuItem onClick={() => handleProjectAction("unpublish", project._id)}>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Unpublish
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleProjectAction("manage-access", project._id)}>
                            <Users className="mr-2 h-4 w-4" />
                            Manage Access
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/50"
                            onClick={() => handleProjectAction("delete", project._id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  <div
                    className="h-36 bg-cover bg-center bg-gray-100 dark:bg-gray-800"
                    style={{ backgroundImage: `url(${project.thumbnail})` }}
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Edited {formatTimeAgo(project.lastEdited)}
                      </p>
                    </div>
                    <Badge variant={project.visibility === 'private' ? 'outline' : 'default'}>
                      {project.visibility === 'private' ? 'Private' : 'Public'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project{selectedProjects.length > 1 ? 's' : ''}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedProjects.length === 1 ? 'this project' : `these ${selectedProjects.length} projects`}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDeleteSelected}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
            <DialogDescription>
              Enter a new name for your project.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid gap-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                placeholder="Enter project name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRename}
              disabled={isRenaming || !newProjectTitle.trim()}
            >
              {isRenaming ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Access Management Dialog */}
      <Dialog open={accessManagementOpen} onOpenChange={setAccessManagementOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Project Access</DialogTitle>
            <DialogDescription>
              Configure who can access this project and their permission level.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={userSearchQuery}
                onChange={(e) => handleUserSearch(e.target.value)}
              />
              {userSearchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                  {userSearchResults.map((user) => (
                    <div
                      key={user._id}
                      className="p-2 hover:bg-accent cursor-pointer"
                      onClick={() => addUserToProject(user)}
                    >
                      {user.name} ({user.email})
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3 max-h-60 overflow-auto">
              {projectUsers.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No users have access to this project yet. Search and add users above.
                </p>
              ) : (
                projectUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-2 rounded border"
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Select
                      defaultValue={user.access}
                      onValueChange={(value) =>
                        handleAccessChange(user._id, value as 'view' | 'edit')
                      }
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Access" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">View</SelectItem>
                        <SelectItem value="edit">Edit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAccessManagementOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={saveAccessChanges}
              disabled={savingAccess}
            >
              {savingAccess ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}