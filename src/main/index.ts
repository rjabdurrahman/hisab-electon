import "reflect-metadata";
import { app, shell, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import { AppDataSource } from "./database/data-source";
import { InventoryService } from "./services/inventory.service";
import { Category } from "./database/entities/Category";
import { Product } from "./database/entities/Product";

async function initializeDatabase() {
  try {
    await AppDataSource.initialize();
    console.log("Database initialized successfully!");
    
    // Seed sample inventory data if empty
    const categoryRepo = AppDataSource.getRepository(Category);
    if ((await categoryRepo.count()) === 0) {
      const category = new Category();
      category.name = "Electronics";
      category.description = "Primary Gadgets";
      await categoryRepo.save(category);

      const productRepo = AppDataSource.getRepository(Product);
      const initialProducts = [
        { name: "MacBook Pro", price: 1999.00, stock: 5, category },
        { name: "iPhone 15", price: 999.00, stock: 12, category },
      ];

      for (const p of initialProducts) {
        const product = new Product();
        product.name = p.name;
        product.price = p.price;
        product.stock = p.stock;
        product.category = p.category;
        await productRepo.save(product);
      }
      console.log("Seeded basic inventory data.");
    }
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
}

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId("com.electron");

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  await initializeDatabase();

  // Unified IPC Gateway
  ipcMain.handle("api-invoke", async (_event, action: string, payload: any) => {
    try {
      switch (action) {
        case "CATEGORY:LIST":
          return await InventoryService.getAllCategories();
        case "CATEGORY:CREATE":
          return await InventoryService.createCategory(payload.name, payload.description);
        case "INVENTORY:FETCH":
          return await InventoryService.getCategoryWithProducts(payload.categoryId);
        case "INVENTORY:ADD_PRODUCT":
          return await InventoryService.addProduct(payload.categoryId, payload.product);
        default:
          throw new Error(`Unknown action: ${action}`);
      }
    } catch (error: any) {
      console.error(`IPC Error [${action}]:`, error);
      throw error;
    }
  });

  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
