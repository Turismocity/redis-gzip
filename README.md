# redis-gzip
Implementacion de redis que autocomprime el contenido


Inspirado por
http://labs.octivi.com/how-we-cut-down-memory-usage-by-82/


> ## Compress your data!
###It’s a big win if you compress data before saving to Redis.

> In one of our Redis instance we store mid-large json objects. Thanks to PHP gzcompress function which internally uses ZLIB library we were able to reduce memory usage by 82% – from about 340 GB to 60 GB. Due to that, now we need only one server with 64GB of RAM instead of having instance with 512 GB which would be likely 3 times more expensive. It was the way we could scale up and avoid premature horizontally scaling.In one of our Redis instance we store mid-large json objects. Thanks to PHP gzcompress function which internally uses ZLIB library we were able to reduce memory usage by 82% – from about 340 GB to 60 GB. Due to that, now we need only one server with 64GB of RAM instead of having instance with 512 GB which would be likely 3 times more expensive. It was the way we could scale up and avoid premature horizontally scaling.

