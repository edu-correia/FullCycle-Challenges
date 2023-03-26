# Challenge #1 - Go Lang Hello World
### Chapter 1  - Docker

<br>

## :clipboard: Challenge:
Publish a Docker image on Docker Hub. When running this image, its output should be a "FullCycle Rocks!" message.
\
Rules:
- You should use Go Lang to print the message
- You should optimize your Docker image to a maximum of 2MB in size

<br>

## :bulb: Solution:
For this challenge, I had to use a multi-staged build. In the first stage I use a Go Lang image to build my Go file into a binary file, and in the second stage, I build a image from scratch that copies the binary from the first(builder) stage and executes it.

<br>

## :arrow_forward: How to run it:
Pull [my docker image from Docker Hub](https://hub.docker.com/r/eduardoehsc/golang):\
`docker pull eduardoehsc/golang`

Run it in your computer:\
`docker run eduardoehsc/golang`