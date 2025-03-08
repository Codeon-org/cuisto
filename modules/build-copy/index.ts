import path from "path";
import fs from "fs"; // Use fs-extra for better file handling
import { defineNuxtModule } from "@nuxt/kit";
import type { NitroOptions } from "nitropack"; // Import NitroOptions

// Define module options
export interface ModuleOptions
{
    /**
     * List of files and folders
     */
    sources: string[];

    /**
     * place all sources in a parent folder
     */
    destination?: string;

    /**
     * Set the destination in the .output/ folder
     */
    root?: keyof NitroOptions["output"];
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: "copy-files",
        configKey: "copyFiles",
    },
    defaults: {
        sources: [], // Default empty, configured in nuxt.config.ts
    },
    setup(options, nuxt)
    {
        nuxt.hook("nitro:build:public-assets", (nitro) =>
        {
            for (const source of options.sources)
            {
                const sourcePath = path.resolve(source);
                const destinationParent = options.destination ?? "";
                const destinationPath = path.join(nitro.options.output[options.root ?? "dir"], destinationParent, path.basename(source));

                if (!fs.existsSync(sourcePath))
                {
                    console.warn(`⚠️ Source "${sourcePath}" does not exist.`);
                    continue;
                }

                const stats = fs.statSync(sourcePath);

                if (stats.isDirectory())
                {
                    fs.cpSync(sourcePath, destinationPath, { recursive: true });
                    console.log(`📂 Copied folder: ${sourcePath} → ${destinationPath}`);
                }
                else if (stats.isFile())
                {
                    fs.copyFileSync(sourcePath, destinationPath);
                    console.log(`📄 Copied file: ${sourcePath} → ${destinationPath}`);
                }
            }
        });
    },
});
