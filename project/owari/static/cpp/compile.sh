g++ -c -fPIC ai.cpp -o ai.o
sleep 0.2
g++ -shared -Wl,-soname,libai.so -o libai.so  ai.o
sleep 0.2
