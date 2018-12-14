/*
 * @Author: sky
 * @Date: 2018-12-14 10:49:53
 * @Description: apache 的静态文件功能
 */

const http = require('http');
const fs = require('fs');
const {
    URL
} = require('url');
const path = require('path');


const port = 3000;
const staticUrl = './static';
const mime = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.png': 'image/png',
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/x-javascript'
}


let server = http.createServer((req, res) => {

    // 解析 url
    let urlStr = new URL('http://127.0.0.1:' + port + req.url);
    // 拿到 url 部分
    let urlPathName = urlStr.pathname;
    // 解析扩展名
    let urlExtname = path.extname(urlPathName);

    if (urlPathName === '/h') {
        // 服务器重定向
        res.writeHead(302, {
            'Location': 'http://127.0.0.1:3000/'
        });
    }

    // 解决路径中的中文
    if (urlPathName.indexOf('%') !== -1) {
        // 提取 基础名
        let baseName = path.basename(urlPathName, urlExtname);
        // 转换为 中文        
        let str = decodeURI(baseName);
        let index = req.url.indexOf(baseName);
        urlPathName = urlPathName.slice(0, index) + '/' + str + urlExtname;
    }

    if (req.url === '/favicon.ico') {
        res.writeHead(404);
        res.end();
    } else {
        // 文件路径
        let dataStr = staticUrl + urlPathName;

        // 是个文件夹则 读取 文件夹里的 index.html 文件 否则 直接读取文件
        if (urlExtname == '') {
            dataStr += '/index.html';
        }

        // 读取文件
        fs.readFile(dataStr, (err, data) => {
            if (err) {
                console.log(err);
            } else {

                // 设置文件类型
                if (mime.hasOwnProperty(urlExtname)) {
                    res.setHeader('Content-Type', mime[urlExtname]);
                }

                res.end(data);
            }
        });
    }
});

server.listen(port, () => {
    console.log(`server is running at ${port} port`);
});