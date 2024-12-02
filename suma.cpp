#include <iostream>
using namespace std;

int main(int argc, char* argv[]) {
    if (argc != 3) {
        std::cout << "Error: Se necesitan 2 argumentos" << std::endl;
        return 1;
    }

    int a = atoi(argv[1]);
    int b = atoi(argv[2]);
    std::cout << (a + b) << std::endl;
    return 0;
}
