var path = require('path'), fs=require('fs');

let mpv_script = "";
let encoder = null;
let script_filename = "softsub-to-hardsub";
if (process.platform === "win32") {
    script_filename += ".bat";
}

console.log("Encoders list:")
console.log("1 - libx264 H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10");
console.log("2 - libx265 H.265 / HEVC");
console.log("3 - NVIDIA NVENC H.264 encoder");
console.log("4 - NVIDIA NVENC hevc encoder");

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Which encoder will you use?', (answer) => {

    answer = Number.parseFloat(answer);
    if(answer > 4 && answer < 1)
    {
        console.log("Wrong number, default encoder used");
    }
    else
    {
        if(answer === 1)
        {
            console.log(`You selected: libx264 H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10`);
            encoder = ' --ovc=libx264';
        }
        if(answer === 2)
        {
            console.log(`You selected: libx265 H.265 / HEVC`);
            encoder = ' --ovc=libx265';
        }
        if(answer === 3)
        {
            console.log(`You selected: NVIDIA NVENC H.264 encoder`);
            encoder = ' --ovc=h264_nvenc';
        }
        if(answer === 4)
        {
            console.log(`You selected: NVIDIA NVENC hevc encoder`);
            encoder = ' --ovc=hevc_nvenc';
        }

    }


    rl.close();

    // https://stackoverflow.com/a/25462405/3857400
    function fromDir(startPath,filter){

        //console.log('Starting from dir '+startPath+'/');

        if (!fs.existsSync(startPath)){
            console.log("no dir ",startPath);
            return;
        }

        var files=fs.readdirSync(startPath);
        for(var i=0;i<files.length;i++){
            var filename=path.join(startPath,files[i]);
            var stat = fs.lstatSync(filename);
            if (stat.isDirectory()){
                fromDir(filename,filter); //recurse
            }
            else if (filename.indexOf(filter)>=0) {
                //console.log('-- found: ',filename);
                //console.log('mpv "'+ filename + '" --o "' + filename.replace('.mkv', '') + '.mp4" --sub-ass');
                mpv_script += 'mpv "'+ filename + '" --o "' + filename.replace('.mkv', '') + '.mp4" --sub-ass'+ (encoder !== null ? encoder : '') +'\n';
            }
        }
        console.log(mpv_script);
        fs.writeFile(script_filename, mpv_script, function (error) {
            if(error)
            {
                console.log(error);
            }
        });
    }

    fromDir(__dirname,'.mkv');
});



