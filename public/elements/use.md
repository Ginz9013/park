### 轉 webm

```
ffmpeg -framerate 30 -pattern_type glob -i '250612_map_vote_*.png' -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 2M output.webm

ffmpeg -framerate 30 -pattern_type glob -i '250612_map_water_*.png' -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 2M output.webm

ffmpeg -framerate 30 -pattern_type glob -i '250612_map_wheel_*.png' -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 2M output.webm

ffmpeg -framerate 30 -pattern_type glob -i '250612_map_bg_*.png' -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 2M output.webm
```
