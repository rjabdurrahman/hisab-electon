import 'reflect-metadata'
import { app, shell, BrowserWindow, ipcMain, Menu } from 'electron'
import { join } from 'path'
import fs from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { AppDataSource } from './database/data-source'
import { ConsultationService } from './services/consultation.service'
import { PatientService } from './services/patient.service'
import { DoctorService } from './services/doctor.service'
import { InvestigationService } from './services/investigation.service'
import { PathologyService } from './services/pathology.service'
import { InvestigationCategoryService } from './services/investigationCategory.service'
import { Doctor } from './database/entities/Doctor'
import { Investigation } from './database/entities/Investigation'

async function initializeDatabase() {
  try {
    await AppDataSource.initialize()
    console.log('Database initialized successfully!')

    // Seed initial data if empty
    const doctorRepo = AppDataSource.getRepository(Doctor)
    if ((await doctorRepo.count()) === 0) {
      await doctorRepo.save([
        {
          name: 'Dr. Mahbubur Rahman',
          specialization: 'Cardiology',
          phone: '01712345678',
          consultationFee: 500
        },
        {
          name: 'Dr. Nasrin Akter',
          specialization: 'Pediatrics',
          phone: '01812345679',
          consultationFee: 400
        },
        {
          name: 'Dr. Ashraful Islam',
          specialization: 'Orthopedics',
          phone: '01912345680',
          consultationFee: 600
        }
      ])
      console.log('Seeded basic doctors.')
    }

    const investigationRepo = AppDataSource.getRepository(Investigation)
    if ((await investigationRepo.count()) === 0) {
      await investigationRepo.save([
        { name: 'CBC', price: 350, category: 'Pathology' },
        { name: 'Blood Glucose (RBS)', price: 100, category: 'Pathology' },
        { name: 'ECG', price: 400, category: 'Diagnostic' },
        { name: 'X-Ray Chest', price: 500, category: 'Radiology' }
      ])
      console.log('Seeded basic investigations.')
    }
  } catch (error) {
    console.error('Database initialization failed:', error)
  }
}

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  await initializeDatabase()

  ipcMain.handle('api-invoke', async (_event, action: string, payload: any) => {
    try {
      switch (action) {
        // Patient Actions
        case 'PATIENT:LIST':
          return await PatientService.getAll()
        case 'PATIENT:CREATE':
          return await PatientService.create(payload)
        case 'PATIENT:UPDATE':
          return await PatientService.update(payload.id, payload.data)
        case 'PATIENT:DELETE':
          return await PatientService.delete(payload.id)

        // Doctor Actions
        case 'DOCTOR:LIST':
          return await DoctorService.getAll()
        case 'DOCTOR:CREATE':
          return await DoctorService.create(payload)
        case 'DOCTOR:UPDATE':
          return await DoctorService.update(payload.id, payload.data)
        case 'DOCTOR:DELETE':
          return await DoctorService.delete(payload.id)

        // Investigation Actions
        case 'INVESTIGATION:LIST':
          return await InvestigationService.getAll()
        case 'INVESTIGATION:CREATE':
          return await InvestigationService.create(payload)
        case 'INVESTIGATION:UPDATE':
          return await InvestigationService.update(payload.id, payload.data)
        case 'INVESTIGATION:DELETE':
          return await InvestigationService.delete(payload.id)

        // Pathology Test Actions
        case 'PATHOLOGY:LIST':
          return await PathologyService.getAll()
        case 'PATHOLOGY:CREATE':
          return await PathologyService.create(payload)
        case 'PATHOLOGY:DELETE':
          return await PathologyService.delete(payload.id)

        // Consultation Actions
        case 'CONSULTATION:LIST':
          return await ConsultationService.getAll()
        case 'CONSULTATION:CREATE':
          return await ConsultationService.create(payload)
        case 'CONSULTATION:UPDATE':
          return await ConsultationService.update(payload.id, payload.data)
        case 'CONSULTATION:DELETE':
          return await ConsultationService.delete(payload.id)

        // Investigation Category Actions
        case 'INVESTIGATION_CATEGORY:LIST':
          return await InvestigationCategoryService.getAll()
        case 'INVESTIGATION_CATEGORY:CREATE':
          return await InvestigationCategoryService.create(payload)
        case 'INVESTIGATION_CATEGORY:UPDATE':
          return await InvestigationCategoryService.update(payload.id, payload.data)
        case 'INVESTIGATION_CATEGORY:DELETE':
          return await InvestigationCategoryService.delete(payload.id)

        // APP:GENERATE_PDF - Creates a PDF file in background (Hidden Window)
        case 'APP:GENERATE_PDF': {
          return new Promise((resolve, reject) => {
            const printWindow = new BrowserWindow({
              show: false,
              webPreferences: {
                preload: join(__dirname, '../preload/index.js'),
                sandbox: true,
                contextIsolation: true,
                nodeIntegration: false
              }
            })

            const dataParam = encodeURIComponent(JSON.stringify(payload.data))
            const hash = `/print/pathology?data=${dataParam}`

            if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
              const url = `${process.env['ELECTRON_RENDERER_URL']}#${hash}`
              console.log(`[PDF Engine] Dev Loading URL: ${url}`)
              printWindow.loadURL(url)
            } else {
              const filePath = join(__dirname, '../renderer/index.html')
              console.log(`[PDF Engine] Prod Loading File: ${filePath} with hash: ${hash}`)
              printWindow.loadFile(filePath, { hash })
            }

            // Wait for signal OR just wait a bit (Dolil/Standard approach)
            // 1.2s is usually plenty for local React components to settle
            setTimeout(async () => {
              try {
                console.log(`[PDF Engine] Capturing PDF...`)
                const data = await printWindow.webContents.printToPDF({
                  printBackground: true,
                  pageSize: 'A5',
                  margins: {
                    top: 0.2,
                    bottom: 0.2,
                    left: 0.2,
                    right: 0.2
                  }
                })

                const tempDir = join(app.getPath('temp'), 'hisab_prints')
                if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })

                const fileName = `receipt_${Date.now()}.pdf`
                const filePath = join(tempDir, fileName)
                fs.writeFileSync(filePath, data)

                console.log(`[PDF Engine] PDF generated at: ${filePath}`)
                printWindow.close()
                resolve({ success: true, filePath })
              } catch (err) {
                console.error(`[PDF Engine] Error:`, err)
                if (!printWindow.isDestroyed()) printWindow.close()
                reject(err)
              }
            }, 1200)
          })
        }

        // APP:OPEN_PDF_VIEWER - Opens a dedicated PDF viewer window
        case 'APP:OPEN_PDF_VIEWER': {
          const { filePath, title } = payload
          if (!fs.existsSync(filePath)) throw new Error('PDF file not found')

          const pdfWindow = new BrowserWindow({
            title: title || 'Print Preview',
            autoHideMenuBar: true,
            width: 1024,
            height: 768,
            webPreferences: {
              plugins: true, // Enables Chromium PDF native viewer
              nodeIntegration: false,
              contextIsolation: true
            }
          })

          // Custom Native Menu for PDF Window
          const menu = Menu.buildFromTemplate([
            {
              label: 'ফাইল', // User prefers Bengali labels
              submenu: [
                {
                  label: 'প্রিন্ট',
                  accelerator: 'CmdOrCtrl+P',
                  click: () => pdfWindow.webContents.print()
                },
                { type: 'separator' },
                {
                  label: 'উইন্ডো বন্ধ করুন',
                  accelerator: 'CmdOrCtrl+W',
                  click: () => pdfWindow.close()
                }
              ]
            }
          ])
          pdfWindow.setMenu(menu)
          pdfWindow.maximize()
          pdfWindow.loadURL(`file://${filePath}`)
          return true
        }

        case 'APP:DONE_READY_TO_PRINT':
          // Legacy/No longer strictly needed for PDF Engine but kept for direct APP:PRINT
          ipcMain.emit('api-invoke-DONE_READY_TO_PRINT')
          return true

        // App Actions
        case 'APP:PRINT': {
          const printWindow = new BrowserWindow({
            show: false, // Hidden window
            webPreferences: {
              preload: join(__dirname, '../preload/index.js'),
              sandbox: true,
              contextIsolation: true
            }
          })

          const dataParam = encodeURIComponent(JSON.stringify(payload.data))
          const hash = `/print/pathology?data=${dataParam}`

          if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            printWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#${hash}`)
          } else {
            printWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash })
          }

          // We wait for the renderer to say it's ready to print
          ipcMain.once('api-invoke-DONE_READY_TO_PRINT', () => {
            printWindow.webContents.print(
              {
                silent: payload?.silent ?? false,
                printBackground: payload?.printBackground ?? false
              },
              () => {
                printWindow.close()
              }
            )
          })
          return true
        }

        default:
          throw new Error(`Unknown action: ${action}`)
      }
    } catch (error: any) {
      console.error(`IPC Error [${action}]:`, error)
      throw error
    }
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
