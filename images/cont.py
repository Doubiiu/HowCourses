import cv2
import numpy as np
if __name__ == '__main__':
    list = ['home','course','focus','mine','comment']
    imlist = []
    image = None
    for idx, i in enumerate(list):
        im = cv2.imread(i + '.png')
        im = cv2.resize(im, (640, 1140))
        print(type(im))
        if idx == 0:
            image = im
        else:
            image = np.hstack((image, im))
    cv2.imshow('im', image)
    cv2.imwrite('cont.png', image)
