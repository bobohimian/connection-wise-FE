import { useState } from "react";
import { Save, Share2, Settings, User, Undo2, Redo2, Maximize2, Minimize2, FileText, ChevronDown } from "lucide-react";
import { useToast } from "../components/provider/toast";
import Dropdown from "./ui/Dropdown";
import IconButton from "./ui/IconButton";
import ThemeToggle from "./ui/ThemeToggle";
import { useReactFlow } from "@xyflow/react";
import { clearUserInfo, setAuthenticated } from "../store/slices/user";
import { useDispatch } from "react-redux";
import { clearActiveDropdownId } from "../store/slices/ui";
export default function Navbar() {

  const dispatch = useDispatch()

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [documentName, setDocumentName] = useState("Untitled Note");
  const [isEditing, setIsEditing] = useState(false);

  const { toast } = useToast();
  const { getZoom, zoomIn, zoomOut } = useReactFlow();
  const zoomLever = getZoom()

  const handleSave = () => {
    toast({
      title: "Note saved",
      description: "Your note has been saved successfully.",
    });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const fileDropdown = {
    id: "file-dropdown",
    label: "File",
    icon: <ChevronDown className="h-3 w-3" />,
    items: [
      {
        type: "button",
        label: "New Note",
      },
      {
        type: "button",
        label: "Save",
        onClick: () => handleSave()
      },
      {
        type: "button",
        label: "Open...",
      },
      {
        type: "separator",
      },
      {
        type: "button",
        label: "Export as PDF",
      },
      {
        type: "button",
        label: "Export as Image",
      },
    ]
  }
  const editDropdown = {
    id: "edit-dropdown",
    label: "Edit",
    icon: <ChevronDown className="h-3 w-3" />,
    items: [
      {
        type: "button",
        label: "Undo",
      },
      {
        type: "button",
        label: "Redo",
      },
      {
        type: "button",
        label: "Cut",
      },
      {
        type: "separator",
      },
      {
        type: "button",
        label: "Copy",
      },
      {
        type: "button",
        label: "Paste",
      },
    ]
  }
  const viewDropdown = {
    id: "view-dropdown",
    label: "View",
    icon: <ChevronDown className="h-3 w-3" />,
    items: [
      {
        type: "button",
        label: "Zoom In",
      },
      {
        type: "button",
        label: "Zoom Out",
      },
      {
        type: "button",
        label: "Reset Zoom",
      },
    ]
  }
  const userDropdown = {
    id: "user-dropdown",
    label: <User className="h-5 w-5" />,
    icon: <ChevronDown className="h-3 w-3" />,
    items: [
      {
        type: "button",
        label: "Profile",
      },
      {
        type: "button",
        label: "Settings",
      },
      {
        type: "button",
        label: "Log out",
        onClick: () => {
          dispatch(clearActiveDropdownId())
          dispatch(clearUserInfo())
          dispatch(setAuthenticated(false))
        }
      },
    ]
  }
  return (
    <header className="flex h-14 items-center justify-between border-b px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 w-58">
          <FileText className="h-5 w-5 text-primary" />
          {isEditing ? (
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
              className="w-full border-b border-input bg-transparent px-1 text-sm font-medium focus:outline-none overflow-hidden text-ellipsis"
              autoFocus
            />
          ) : (
            <h1 className="w-full text-sm font-medium cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap" onClick={() => setIsEditing(true)}>
              {documentName}
            </h1>
          )}
        </div>
        <div className="hidden md:flex items-center gap-1">
          <Dropdown
            id={fileDropdown.id}
            label={fileDropdown.label}
          >
            {fileDropdown.items.map((item) => {
              if (item.type === "button")
                return (
                  <button
                    key={`${item.label}-button`}
                    onClick={() => { item.onClick() }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {item.label}
                  </button>)
              else if (item.type === "separator")
                return (<div key={`${item.label}-separator`} className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>)
              return null
            })}
          </Dropdown>
          <Dropdown
            id={editDropdown.id}
            label={editDropdown.label}
          >
            {editDropdown.items.map((item) => {
              if (item.type === "button")
                return (
                  <button
                    key={`${item.label}-button`}
                    onClick={() => { item.onClick() }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {item.label}
                  </button>)
              else if (item.type === "separator")
                return (<div key={`${item.label}-separator`} className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>)
              return null
            })}
          </Dropdown>
          <Dropdown
            id={viewDropdown.id}
            label={viewDropdown.label}
          >
            {viewDropdown.items.map((item) => {
              if (item.type === "button")
                return (
                  <button
                    key={`${item.label}-button`}
                    onClick={() => { item.onClick() }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {item.label}
                  </button>)
              else if (item.type === "separator")
                return (<div key={`${item.label}-button`} className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>)
              return null
            })}
          </Dropdown>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle></ThemeToggle>
        <div className="md:flex items-center gap-2">
          <IconButton icon={<Undo2 className="h-4 w-4" />} srOnly={"Undo"}
            onClick={() => toast({ title: "Undo", description: "Action undone" })} />
          <IconButton icon={<Redo2 className="h-4 w-4" />} srOnly={"Undo"}
            onClick={() => toast({ title: "Redo", description: "Action redone" })} />
          <div className="text-xs text-muted-foreground">{`Zoom:${(zoomLever * 100).toFixed(0)}%`}</div>
        </div>
        <IconButton icon={isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          srOnly={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"} onClick={() => toggleFullscreen()} />
        <IconButton icon={<Save className="h-4 w-4" />} srOnly={"Save"}
          onClick={() => handleSave()} />

        <IconButton icon={<Share2 className="h-4 w-4" />} srOnly={"Share"}
          onClick={() => toast({ title: "Share", description: "Sharing options opened" })} />
        <IconButton icon={<Settings className="h-4 w-4" />} srOnly={"Settings"}
          onClick={() => toast({ title: "Settings", description: "Settings opened" })} />
        <Dropdown
          id={userDropdown.id}
          label={userDropdown.label}
          alignTo="right"
        >
          {userDropdown.items.map((item) => {
            if (item.type === "button")
              return (
                <button
                  key={`${item.label}-button`}
                  onClick={() => { item.onClick() }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {item.label}
                </button>)
            else if (item.type === "separator")
              return (<div key={`${item.label}-button`} className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>)
            return null
          })}
        </Dropdown>
      </div>
    </header >
  );
}