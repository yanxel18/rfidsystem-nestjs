FROM node:20.13-alpine AS BaseImage

ARG PROXY_URL

ENV http_proxy=${PROXY_URL}
ENV https_proxy=${PROXY_URL}

RUN apk add --no-cache libc6-compat
#Copy required Files
COPY . ./
#Generate node_modules
RUN npm install
#generate prisma based on env
RUN npx prisma generate

RUN npm run build
#Copy from BaseImage
FROM node:20.13-alpine AS Production
#set working directory
WORKDIR /app/
ARG PROXY_URL

ENV http_proxy=${PROXY_URL}
ENV https_proxy=${PROXY_URL}
#add curl to nodealpine to support curl healthcheck
RUN apk update
RUN apk --no-cache add curl
COPY  downloads ./downloads
COPY  prisma ./prisma
COPY --from=BaseImage node_modules ./node_modules
COPY --from=BaseImage dist ./dist
COPY  package.json .

ENV TZ=Asia/Tokyo
ENV http_proxy=
ENV https_proxy=
EXPOSE 3100

CMD ["npm","run","start:dist"]
