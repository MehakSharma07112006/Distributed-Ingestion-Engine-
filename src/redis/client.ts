import RedisManager from "./redisManager";

const redisClient = new RedisManager({
    host: 'localhost',
    port: 6379,
})

export default redisClient;
