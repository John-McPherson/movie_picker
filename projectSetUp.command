echo Scaffolding project...

cd "$(dirname "$BASH_SOURCE")" || {
echo "Error getting script directory" >&2
exit 1
};
script=""
styles=""


read -p 'Does the project use jquery y/n   ' jquery
read -p 'Does the project use video.js y/n   ' video
read -p 'Does the project use slick.js y/n   ' slick
read -p 'Does the project use swiper.js y/n   ' swiper


mkdir assets
cd assets 
mkdir less js images css
cd less 
touch style.less mixins.less resets.less
printf  "html{color-scheme:dark light;body{min-height:100vh;margin:0;padding:0;*,*::before,*::after{box-sizing:border-box}*{margin:0;padding:0;font:inherit}li{list-style:none}a{text-decoration:none;color:unset}button{background-color:unset;border:unset;padding:unset;cursor:pointer}img,picture,svg,video{max-width:100%%;display:block}}}"  >> resets.less
printf "@import url("./resets.less");@import url("./mixins.less");" >> style.less

cd .. 
cd js 
mkdir lib
touch main.js

cd lib

if [ $jquery = 'y' ]
then
wget https://code.jquery.com/jquery-3.6.4.min.js
mv jquery-3.6.4.min.js jquery.min.js
script="$script <script src='./assets/js/lib/jquery.min.js'></script>"

fi

if [ $slick = 'y' ]
then
wget cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js
script="$script <script src='./assets/js/lib/slick.min.js'></script>"
styles="$styles <link rel='stylesheet' href='./assets/css/slick.css'>"
fi

if [ $video = 'y' ]
then
wget https://vjs.zencdn.net/8.0.4/video.min.js
script="$script <script src='./assets/js/lib/video.min.js'></script>"
styles="$styles <link rel='stylesheet' href='./assets/css/video-js.css'>"
fi

if [ $swiper = 'y' ]
then
wget https://cdn.jsdelivr.net/npm/swiper@9.1.0/swiper-bundle.min.js
mv swiper-bundle.min.js swiper.min.js
script="$script <script src='./assets/js/lib/swiper.min.js'></script>"
styles="$styles <link rel='stylesheet' href='./assets/css/swiper.min.css'>"
fi
cd ..
cd ..
cd css 
wget https://necolas.github.io/normalize.css/8.0.1/normalize.css

if [ $video = 'y' ]
then
wget https://vjs.zencdn.net/8.0.4/video-js.css
fi

if [ $slick = 'y' ]
then
wget cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css
fi

if [ $swiper = 'y' ]
then
wget https://cdn.jsdelivr.net/npm/swiper@9.1.0/swiper-bundle.min.css
mv swiper-bundle.min.css swiper.min.css 
fi
cd .. 
cd .. 

touch index.html
touch .gitignore
touch .htaccess
printf ".DS_Store\nbrackets.json\n*.config\n*.zip\n/_assets\n/_ipa\n*.mp4\n" >> .gitignore
printf "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta http-equiv='X-UA-Compatible' content='IE=edge'><meta name='viewport' content='width=device-width,initial-scale=1'><title>Document</title> $styles <link rel='stylesheet' href='./assets/css/normalize.css'><link rel='stylesheet' href='./assets/css/style.css'></head><body>$script <script src='./assets/js/main.js'></script></body></html>" >> index.html 
printf "# allows any user to see this directory\nSatisfy Any\nRequire all granted\n" >> .htaccess


echo project ready.











