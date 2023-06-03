#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use open;
use tauri::Manager;
use tauri::{
    CustomMenuItem, GlobalShortcutManager, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem, SystemTraySubmenu,
};
use tauri_plugin_window_state::{AppHandleExt, StateFlags};

#[cfg(target_os = "macos")]
use cocoa::appkit::{NSWindow, NSWindowButton, NSWindowStyleMask, NSWindowTitleVisibility};

#[cfg(target_os = "macos")]
use objc::runtime::YES;

use tauri::{Runtime, Window};

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

pub trait WindowExt {
    #[cfg(target_os = "macos")]
    fn set_transparent_titlebar(&self, title_transparent: bool, remove_toolbar: bool);
}

impl<R: Runtime> WindowExt for Window<R> {
    #[cfg(target_os = "macos")]
    fn set_transparent_titlebar(&self, title_transparent: bool, remove_tool_bar: bool) {
        unsafe {
            let id = self.ns_window().unwrap() as cocoa::base::id;
            NSWindow::setTitlebarAppearsTransparent_(id, cocoa::base::YES);
            let mut style_mask = id.styleMask();
            style_mask.set(
                NSWindowStyleMask::NSFullSizeContentViewWindowMask,
                title_transparent,
            );

            id.setStyleMask_(style_mask);

            if remove_tool_bar {
                let close_button = id.standardWindowButton_(NSWindowButton::NSWindowCloseButton);
                let _: () = msg_send![close_button, setHidden: YES];
                let min_button =
                    id.standardWindowButton_(NSWindowButton::NSWindowMiniaturizeButton);
                let _: () = msg_send![min_button, setHidden: YES];
                let zoom_button = id.standardWindowButton_(NSWindowButton::NSWindowZoomButton);
                let _: () = msg_send![zoom_button, setHidden: YES];
            }

            id.setTitleVisibility_(if title_transparent {
                NSWindowTitleVisibility::NSWindowTitleHidden
            } else {
                NSWindowTitleVisibility::NSWindowTitleVisible
            });

            id.setTitlebarAppearsTransparent_(if title_transparent {
                cocoa::base::YES
            } else {
                cocoa::base::NO
            });
        }
    }
}

#[tauri::command]
fn set_review_count(app_handle: tauri::AppHandle, count: &str) {
    let mut rev_count = count.to_string();
    rev_count.insert_str(0, " ");
    #[cfg(target_os = "macos")]
    app_handle.tray_handle().set_title(&rev_count).unwrap();
}

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit").accelerator("Cmd+Q");
    let hide_app = CustomMenuItem::new("hide_app".to_string(), "Hide Yack").accelerator("Escape");
    let open_yack =
        CustomMenuItem::new("open_yack".to_string(), "Open Yack").accelerator("Ctrl+Shift+Space");
    let version = CustomMenuItem::new(
        "version".to_string(),
        format!("Version {}", env!("CARGO_PKG_VERSION")),
    )
    .disabled();
    let check_updates = CustomMenuItem::new("check_updates".to_string(), "Check for Updates");
    let send_feedback = CustomMenuItem::new("send_feedback".to_string(), "Send Feedback");
    let history = CustomMenuItem::new("history".to_string(), "History").accelerator("Cmd+P");
    let new_chat = CustomMenuItem::new("new_chat".to_string(), "New Chat").accelerator("Cmd+N");
    let light_theme = CustomMenuItem::new("light_theme".to_string(), "Light");
    let dark_theme = CustomMenuItem::new("dark_theme".to_string(), "Dark");
    let andromeda_theme = CustomMenuItem::new("andromeda_theme".to_string(), "Andromeda");

    let themes = SystemTraySubmenu::new(
        "Themes",
        SystemTrayMenu::new()
            .add_item(light_theme)
            .add_item(dark_theme)
            .add_item(andromeda_theme),
    );

    let tray_menu = SystemTrayMenu::new()
        .add_item(open_yack)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(new_chat)
        .add_item(history)
        .add_submenu(themes)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(send_feedback)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(version)
        .add_item(check_updates)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(hide_app)
        .add_item(quit);

    let system_tray = SystemTray::new()
        .with_menu(tray_menu)
        .with_menu_on_left_click(true);

    tauri::Builder::default()
        .system_tray(system_tray)
        .on_system_tray_event(move |app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "open_yack" => {
                    let w = app.get_window("main").unwrap();
                    let visible = w.is_visible().unwrap();
                    if visible {
                        w.hide().unwrap();
                    } else {
                        w.show().unwrap();
                        w.set_focus().unwrap();
                    }
                }
                "quit" => {
                    app.save_window_state(StateFlags::all()).unwrap();
                    std::process::exit(0);
                }
                "new_chat" => {
                    let w = app.get_window("main").unwrap();
                    w.show().unwrap();
                    w.set_focus().unwrap();
                    w.eval("window.location.href='/chat/new'").unwrap();
                }
                "hide_app" => {
                    let w = app.get_window("main").unwrap();
                    w.hide().unwrap();
                }
                "history" => {
                    let w = app.get_window("main").unwrap();
                    w.show().unwrap();
                    w.set_focus().unwrap();
                    w.eval("window.location.href='/history'").unwrap();
                }
                "send_feedback" => {
                    // Open mail app
                    let email_id = "rajatkulkarni95@gmail.com";
                    let email_url = format!(
                        "mailto:{}?subject=Feedback on Yack v{}",
                        email_id,
                        env!("CARGO_PKG_VERSION")
                    );
                    if let Err(e) = open::that(email_url) {
                        eprintln!("Error launching mail client: {}", e);
                    }
                }
                "check_updates" => {
                    let w = app.get_window("main").unwrap();
                    w.trigger_global("tauri://update", None);
                    // w.emit("tauri://update", "");
                }
                "light_theme" => {
                    let w = app.get_window("main").unwrap();
                    w.show().unwrap();
                    w.set_focus().unwrap();
                    w.eval("document.documentElement.setAttribute('data-theme', 'light')")
                        .unwrap();
                }
                "dark_theme" => {
                    let w = app.get_window("main").unwrap();
                    w.show().unwrap();
                    w.set_focus().unwrap();
                    w.eval("document.documentElement.setAttribute('data-theme', 'dark')")
                        .unwrap();
                }
                "andromeda_theme" => {
                    let w = app.get_window("main").unwrap();
                    w.show().unwrap();
                    w.set_focus().unwrap();
                    w.eval("document.documentElement.setAttribute('data-theme', 'andromeda')")
                        .unwrap();
                }
                _ => {}
            },
            _ => {}
        })
        .on_window_event(|event| match event.event() {
            // Blur event
            tauri::WindowEvent::Focused(false) => {
                event.window().set_always_on_top(false).unwrap();
            }
            _ => {}
        })
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .invoke_handler(tauri::generate_handler![set_review_count])
        .setup(|app| {
            #[cfg(target_os = "macos")]
            // don't show on the taskbar/springboard
            app.set_activation_policy(tauri::ActivationPolicy::Accessory);

            let window = app.get_window("main").unwrap();
            #[cfg(target_os = "macos")]
            window.set_transparent_titlebar(true, true);

            window.set_always_on_top(true).unwrap();

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|_app_handle, event| match event {
            tauri::RunEvent::Ready => {
                let mut shortcut_manager = _app_handle.global_shortcut_manager();
                let handle = _app_handle.clone();
                shortcut_manager
                    .register("Ctrl+Shift+Space", move || {
                        let w = handle.get_window("main").unwrap();

                        w.show().unwrap();
                        w.set_focus().unwrap();
                    })
                    .unwrap();
            }
            tauri::RunEvent::ExitRequested { api, .. } => {
                api.prevent_exit();
            }
            _ => {}
        })
}
