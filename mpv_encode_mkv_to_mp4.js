let path = require('path'), fs=require('fs');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let mpv_script = "";
let video_encoder = "libx264";
let audio_encoder = "aac";
let crf_value = "18";
let script_filename = "softsub-to-hardsub";
if (process.platform === "win32") {
    script_filename += ".bat";
}


const venc = () => {
    return new Promise(function (resolve, reject) {
        console.log("Video encoders list:");
        console.log("1 - libx264 H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10");
        console.log("2 - libx265 H.265 / HEVC");
        console.log("3 - NVIDIA NVENC H.264 encoder");
        console.log("4 - NVIDIA NVENC hevc encoder");
        rl.question('Which encoder will you use?', (answer) => {

            answer = Number.parseFloat(answer);
            if (answer > 4 || answer < 1) {
                console.log("Wrong number, default encoder used");
            } else {
                if (answer === 1) {
                    console.log(`You selected: libx264 H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10`);
                    video_encoder = 'libx264';
                }
                if (answer === 2) {
                    console.log(`You selected: libx265 H.265 / HEVC`);
                    video_encoder = 'libx265';
                }
                if (answer === 3) {
                    console.log(`You selected: NVIDIA NVENC H.264 encoder`);
                    video_encoder = 'h264_nvenc';
                }
                if (answer === 4) {
                    console.log(`You selected: NVIDIA NVENC hevc encoder`);
                    video_encoder = 'hevc_nvenc';
                }
            }
            resolve();
        });
    });
};

const aenc = () => {
    return new Promise(function (resolve, reject) {
        console.log("Audio encoders list:");
        console.log("1 - AAC (Advanced Audio Coding)");
        console.log("2 - FLAC (Free Lossless Audio Codec)");
        console.log("3 - Opus");
        console.log("4 - libmp3lame MP3 (MPEG audio layer 3)");
        rl.question('Which encoder will you use?', (answer) => {

            answer = Number.parseFloat(answer);
            if (answer > 4 || answer < 1) {
                console.log("Wrong number, default encoder used");
            } else {
                if (answer === 1) {
                    console.log(`You selected: AAC (Advanced Audio Coding)`);
                    audio_encoder = 'aac';
                }
                if (answer === 2) {
                    console.log(`FLAC (Free Lossless Audio Codec)`);
                    audio_encoder = 'flac';
                }
                if (answer === 3) {
                    console.log(`You selected: Opus`);
                    audio_encoder = 'opus';
                }
                if (answer === 4) {
                    console.log(`You selected: libmp3lame MP3 (MPEG audio layer 3)`);
                    audio_encoder = ' --ovc=hevc_nvenc';
                }
            }
            resolve();
        });
    });
};

const crf = () => {
    return new Promise(function (resolve, reject) {
        rl.question('Select crf value (Leave empty for default - 18)', (answer) => {

            answer = Number.parseFloat(answer);
            if (answer > 51 || answer < 0 || isNaN(answer)) {
                console.log("Wrong number, default crf used");
            } else {
                crf_value = answer;
            }
            resolve();
        });
    });
};

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
            mpv_script += `mpv "${filename}" --o "` + filename.replace('.mkv', '') + `.mp4" --sub-ass ovc=${video_encoder} --oac=${audio_encoder} --ovcopts=crf=${crf_value}\n`;
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


run = async () => {
    await venc();
    await aenc();
    await crf();
    rl.close();
    fromDir(__dirname,'.mkv')
};

run();