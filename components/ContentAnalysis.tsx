// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ScrollArea } from "@/components/ui/scroll-area";

// export default function ContentAnalyzer() {
//   const [content, setContent] = useState("");
//   const [showAnalysis, setShowAnalysis] = useState(false);

//   return (
//     <div className="h-full flex flex-col">
//       <div className="flex-1 p-4">
//         <textarea
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           className="w-full h-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring"
//           placeholder="Paste your content here for analysis..."
//         />
//       </div>
//       <div className="p-4 border-t">
//         <Button 
//           onClick={() => setShowAnalysis(true)}
//           className="w-full"
//           disabled={!content.trim()}
//         >
//           Analyze Content
//         </Button>
//       </div>

//       {showAnalysis && (
//         <div className="flex-1 border-t">
//           <Tabs defaultValue="analyze" className="h-full">
//             <TabsList className="w-full justify-start border-b rounded-none h-12 px-4">
//               <TabsTrigger value="analyze">Analysis</TabsTrigger>
//               <TabsTrigger value="infogain">Info Gain</TabsTrigger>
//               <TabsTrigger value="outline">Outline</TabsTrigger>
//               <TabsTrigger value="rephrase">Rephrase</TabsTrigger>
//             </TabsList>
//             <ScrollArea className="h-[calc(100%-3rem)] p-4">
//               <TabsContent value="analyze" className="m-0">
//                 <h3 className="font-semibold mb-2">Content Analysis</h3>
//                 {/* Add analysis content */}
//               </TabsContent>
//               <TabsContent value="infogain" className="m-0">
//                 <h3 className="font-semibold mb-2">Information Gain</h3>
//                 {/* Add info gain content */}
//               </TabsContent>
//               <TabsContent value="outline" className="m-0">
//                 <h3 className="font-semibold mb-2">Content Outline</h3>
//                 {/* Add outline content */}
//               </TabsContent>
//               <TabsContent value="rephrase" className="m-0">
//                 <h3 className="font-semibold mb-2">Rephrase Suggestions</h3>
//                 {/* Add rephrase content */}
//               </TabsContent>
//             </ScrollArea>
//           </Tabs>
//         </div>
//       )}
//     </div>
//   );
// }