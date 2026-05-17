# Note-Light

[![Docker Image Build](https://github.com/JValtteri/note-light/actions/workflows/build-docker-image.yml/badge.svg)](https://github.com/JValtteri/note-light/actions/workflows/build-docker-image.yml)

> **Not feature complete**

Fast, light weight notetaking web-app.

Offline notes for quick personal notes, when you really need to write something down quickly.

### Intended primary use case is to use on a smart phone and "install" it, to use like an app.

- On Android this is done with Google Chrome and selecting [**add to home screen**](https://support.google.com/chrome/answer/9658361?hl=en&co=GENIE.Platform%3DAndroid).
- On iPhone [**follow this guide**](https://support.apple.com/guide/iphone/open-as-web-app-iphea86e5236/ios)

## Planned features

- [x] Offline note
- [x] Multiple offline notes
- [ ] Online notes (with registered users)
- [ ] Shared notes with a share link

## How to setup dev enviroment

|       | [Frontend](./client/README.md) | [Backend](./server/README.md) |
| ----- | :-------------------: | :----: |
| Lang  | TypeScript <br> React |   Go   |
| vers. | >=5.8.3 <br> >=19.1.1 | >=1.24 |

|           |                                    |
| --------- | :--------------------------------: |
| Frontend  | See [Frontend](./client/README.md) |
| Backend   | See [Backend](./server/README.md)  |

## How to Deploy With Docker

```
note-light
 ├─ docker-compose.yml
 ├─ config.json
 ├─ notes      (auto-generated)
 │  └─ ...     (auto-generated)
 ├─ logo.png   (optional)
 └─ images     (optional)
    └─ ...
```

1. Copy [docker-compose.yml](../docker-compose.yml).
1. Copy [config.json.example](../server/config.json.example) and rename it to `config.json`.
1. [Configure](#configuring) as necessary
1. Check [docker-compose.yml](../docker-compose.yml) as necessary:
    - image version
    - mount settings
    - port
1. Run `docker compose up`
1. Read the log output for any issues
1. Copy the initial admin password from the logs
1. Log in with the admin credentials and change the password.
1. Press `D` to detach from server console

You can check the logs at any time with
```sh
docker logs note-light
```

## How to Use

You can use the app without loggin in. The notes in this case are saved in browser local storage and are available on the same device on the same browser.

**Warning!** Offline notes may be deleted if you reinstall your browser, delete browser data or change devices. Offline notes are not intended for long therm storage of importand data.

## How to Administer

**Registered users are not yet operational. I plan to get to it at some point.**

### Admin account

If an `admin` account doesn't exist, a new `admin` account is created automatically on server start.

**Check server log output for the `admin` credentials.**

- Username is `admin`
- Password is a random string of characters.

**The password should be changed on first login.**

> It is good policy to not share the `admin` account, but create individual accounts and promote them with the necessary roles. This way any policy violations can be tracked and offending accounts can be demoted or removed without affecting other administrators.


| Action | Command |
| -- | -- |
| Start server | `docker compose up` |
| Stop server | `docker compose down` |
| View logs | `docker logs [container_name]` |

#### To update the server
You should run the following commands:
```sh
docker logs [container_name]    # to view the logs before they are wiped
docker compose down             # stop the server
docker compose pull             # download the update
docker compose up               # start the server
```

## License

[See LICENSE](./LICENSE)
