# wsl

a simple tool for piping things into a websocket

it keeps an in-memory buffer of sent information and replays it when new clients connect


# install

    npm install --global wsl
    
    
# usage

    cat file.txt | wsl
    node index.js
    
by default, `wsl` broadcasts on port `43110` (i.e. port hello).

# recieving

    var ws = new WebSocket('ws://localhost:43110')
    ws.onmessage = function(e){
        console.log(e.data)
    }

# help

    ~/P/s/wsl ❯ wsl --help
    Options:
      --help     Show help                                                 [boolean]
      --version  Show version number                                       [boolean]
      --binary   Pipe contents as binary websockets                        [boolean]
      --port     Listen on particular port                          [default: 43110]
      
