import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import EditorPanel from "./editorPanel";
import { Loader2 } from "lucide-react";

interface User {
  id: string;
  email: string;
  fullname?: string;
  imageUrl?: string;
  name?: string;
  image?: string;
}

interface Message {
  id: string;
  role: any;
  content: string;
  timestamp: string;
}

interface Version {
  id: string;
  timestamp: string;
  code: string;
}
interface Project {
  id: string;
  name: string;
  initial_prompt: string;
  current_code: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: User;
  isPublished?: boolean;
  versionId?: string;
  conversation: Message[];
  versions: Version[];
  current_version_index: string;
}

interface ProjectPreviewProps {
  project: Project;
  isGenerating: boolean;
  device?: "phone" | "tablet" | "desktop";
  showEditorPanel?: boolean;
}

export interface ProjectPreviewRef {
  getCode: () => string | undefined;
}

const iframeScript = `
        <style id="ai-preview-style">
        .ai-selected-element {
            outline: 2px solid #6366f1 !important;
        }
        </style>
        <script id="ai-preview-script">
        (function () {
            // If this HTML is opened directly (not in an iframe), do nothing.
            if (window === window.parent) {
            return;
            }

            let selectedElement = null;

            function clearSelected() {
            if (selectedElement) {
                selectedElement.classList.remove('ai-selected-element');
                selectedElement.removeAttribute('data-ai-selected');
                selectedElement.style.outline = '';
                selectedElement = null;
            }
            }

            document.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            clearSelected();

            const target = e.target;

            // Don't select body or html
            if (!target || target.tagName === 'BODY' || target.tagName === 'HTML') {
                window.parent.postMessage({ type: 'CLEAR_SELECTION' }, '*');
                return;
            }

            selectedElement = target;
            selectedElement.classList.add('ai-selected-element');
            selectedElement.setAttribute('data-ai-selected', 'true');

            const computedStyle = window.getComputedStyle(selectedElement);

            window.parent.postMessage({
                type: 'ELEMENT_SELECTED',
                payload: {
                tagName: selectedElement.tagName,
                className: selectedElement.className,
                text: selectedElement.innerText,
                styles: {
                    padding: computedStyle.padding,
                    margin: computedStyle.margin,
                    backgroundColor: computedStyle.backgroundColor,
                    color: computedStyle.color,
                    fontSize: computedStyle.fontSize
                }
                }
            }, '*');
            });

            window.addEventListener('message', function (event) {
            if (event.data.type === 'UPDATE_ELEMENT' && selectedElement) {
                const updates = event.data.payload;

                if (updates.className !== undefined) {
                selectedElement.className = updates.className;
                }

                if (updates.text !== undefined) {
                selectedElement.innerText = updates.text;
                }

                if (updates.styles) {
                Object.assign(selectedElement.style, updates.styles);
                }
            } else if (event.data.type === 'CLEAR_SELECTION_REQUEST') {
                clearSelected();

                // extra safety: remove our class + outline from any stray elements
                document.querySelectorAll('.ai-selected-element,[data-ai-selected]').forEach(function (el) {
                el.classList.remove('ai-selected-element');
                el.removeAttribute('data-ai-selected');
                el.style.outline = '';
                });
            }
            });
        })();
        </script>
`;

const ProjectPreviewPanel = forwardRef<ProjectPreviewRef, ProjectPreviewProps>(
  (
    { project, isGenerating, device = "desktop", showEditorPanel = true },
    ref,
  ) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const resolutions = {
      phone: "w-[412px]",
      tablet: "w-[768px]",
      desktop: "w-full",
    };
    const [currentStep, setCurrentStep] = useState(0);
    const steps = [
      "Analyzing your request...",
      "Planning website structure...",
      "Generating components...",
      "Adding styling and responsiveness...",
      "Finalizing your website...",
    ];
    useEffect(() => {
      if (!isGenerating) {
        setCurrentStep(0);
        return;
      }
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 8000);
      return () => clearInterval(interval);
    }, [isGenerating]);
    useImperativeHandle(ref, () => ({
      getCode: () => {
        const doc = iframeRef.current?.contentDocument;
        if (!doc) return undefined;
        // Remove our selection class/ attirbutes/ outline from all elements
        doc
          .querySelectorAll(".ai-selected-element,[data-ai-selected]")
          .forEach((el) => {
            el.classList.remove("ai-selected-element");
            el.removeAttribute("data-ai-selected");
            (el as HTMLElement).style.outline = "";
          });
        // Remove injected style + script from the document
        const previewStyle = doc.getElementById("ai-preview-style");
        if (previewStyle) previewStyle.remove();
        const previewScript = doc.getElementById("ai-preview-script");
        if (previewScript) previewScript.remove();
        // Serialize clean HTML
        const html = doc.documentElement.outerHTML;
        return html;
      },
    }));
    const handleUpdate = (updates: any) => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { type: "UPDATE_ELEMENT", payload: updates },
          "*",
        );
      }
    };
    const injectPreview = (html: string) => {
      if (!html) return "";

      const scrollbarStyle = `
    <style id="ai-scrollbar-style">
      html,
      body {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }

      html::-webkit-scrollbar,
      body::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
        display: none !important;
      }
    </style>
  `;

      // Only inject iframeScript when editor panel is enabled
      const injected = scrollbarStyle + (showEditorPanel ? iframeScript : "");

      if (html.includes("</head>")) {
        return html.replace("</head>", injected + "</head>");
      }

      if (html.includes("</body>")) {
        return html.replace("</body>", injected + "</body>");
      }

      return injected + html;
    };
    const [selectedElement, setSelectedElement] = useState<any>(null);
    useEffect(() => {
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === "ELEMENT_SELECTED") {
          setSelectedElement(event.data.payload);
        } else if (event.data.type === "CLEAR_SELECTION") {
          setSelectedElement(null);
        }
      };
      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }, []);
    return (
      <div
        className={`relative h-screen z-10 bg-cyan-500 flex-1 max-sm:w-full ${resolutions[device]} mx-auto transition-all`}
      >
        {project.current_code ? (
          <>
            <iframe
              ref={iframeRef}
              srcDoc={injectPreview(project.current_code)}
              onLoad={() => console.log("iframe loaded")}
              onError={() => console.log("iframe error")}
              className={`h-full max-sm:w-full ${resolutions[device]} mx-auto transition-all`}
            />
            {showEditorPanel && selectedElement && (
              <EditorPanel
                selectedElement={selectedElement}
                onUpdate={handleUpdate}
                onClose={() => {
                  setSelectedElement(null);
                  if (iframeRef.current?.contentWindow) {
                    iframeRef.current.contentWindow.postMessage(
                      { type: "CLEAR_SELECTION_REQUEST" },
                      "*",
                    );
                  }
                }}
              />
            )}
          </>
        ) : (
          isGenerating && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="relative flex items-center justify-center size-20 rounded-full border border-white/10">
                <Loader2 className="size-8 animate-spin text-white/70" />
              </div>

              <p className="mt-6 text-white/90">{steps[currentStep]}</p>

              <p className="text-sm text-white/40 mt-2">
                This may take around 15-20 minutes...
              </p>
              <div className="flex items-center gap-2 mt-6">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      index <= currentStep
                        ? "w-8 bg-cyan-200"
                        : "w-1.5 bg-cyan-200/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          )
        )}
      </div>
    );
  },
);
export default ProjectPreviewPanel;
