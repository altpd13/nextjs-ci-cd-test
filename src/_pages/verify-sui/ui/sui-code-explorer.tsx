"use client";

import JSZip from "jszip";
import { File, Folder } from "lucide-react";
import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import SyntaxHighlighter from "react-syntax-highlighter";

type File = {
  name: string;
  content: string;
};

type FileStructure = {
  name: string;
  type: string;
  content: string | null;
  children?: FileStructure[];
};

export const SuiCodeExplorer = (url: string) => {
  const [fileStructure, setFileStructure] = React.useState<FileStructure[]>([]);
  const [selectedFile, setSelectedFile] = React.useState<FileStructure | null>(
    null,
  );

  const processFiles = async (unzipped: any) => {
    const filePromises: any = [];

    unzipped.forEach((relativePath: any, file: any) => {
      if (!file.dir) {
        const filePromise = file.async("text").then((content: any) => {
          return { name: file.name, content: content };
        });
        filePromises.push(filePromise);
      }
    });

    const codes = await Promise.all(filePromises);
    return codes;
  };
  //TODO: Get rid of build file when rendering
  const fetchZip = async (url: string) => {
    const zipFile = await fetch(url);
    const arrayBuffer = await zipFile.arrayBuffer();
    const zipBlob = new Blob([arrayBuffer], { type: "application/zip" });
    const zip = new JSZip();
    const unzippedFiles = await zip.loadAsync(zipBlob);
    const files: File[] = await processFiles(unzippedFiles);

    const structedFiles = files.reduce((acc: FileStructure[], file) => {
      const path = file.name.split("/");
      let current = acc;
      for (let i = 0; i < path.length; i++) {
        const name = path[i];
        const existing = current.find(
          (item: FileStructure) => item.name === name,
        );
        if (existing) {
          current = existing.children!;
        } else {
          const newFolder = {
            name,
            type: i === path.length - 1 ? "file" : "folder",
            content: i === path.length - 1 ? file.content : null,
            children: [],
          };
          current.push(newFolder);
          current = newFolder.children;
        }
      }
      return acc;
    }, []);
    setFileStructure(structedFiles);
  };

  useEffect(() => {
    fetchZip(url);
  }, []);

  const renderFileTree = (items?: FileStructure[]) => {
    return items?.map((item) => (
      <div key={item.name} className="pl-4">
        {item.type === "folder" ? (
          <div>
            <div className="flex items-center py-1">
              <Folder className="mr-2 h-4 w-4" />
              <span>{item.name}</span>
            </div>
            {renderFileTree(item.children)}
          </div>
        ) : (
          <div
            className="flex items-center py-1 cursor-pointer hover:bg-accent hover:text-accent-foreground"
            onClick={() => setSelectedFile(item)}
          >
            <File className="mr-2 h-4 w-4" />
            <span>{item.name}</span>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="border rounded-lg shadow-sm h-[600px] flex">
      <div className="w-1/4 border-r">
        <ScrollArea className="h-full">
          <div className="p-4">
            <h3 className="font-semibold mb-2">Files</h3>
            {renderFileTree(fileStructure)}
          </div>
        </ScrollArea>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold">
            {selectedFile ? selectedFile.name : "No file selected"}
          </h3>
        </div>
        <ScrollArea className="flex-1">
          <SyntaxHighlighter
            language={selectedFile?.name.includes(".rs") ? "rust" : "toml"}
            style={a11yDark}
            wrapLongLines
          >
            {selectedFile
              ? selectedFile.content!
              : "Select a file to view its content"}
          </SyntaxHighlighter>
        </ScrollArea>
      </div>
    </div>
  );
};
