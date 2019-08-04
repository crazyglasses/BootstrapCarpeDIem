import numpy as np

import cv2
def show_video():
    cap = cv2.VideoCapture('../video.mp4')
    flag = True
    frame1 = None
    count = 0
    while(cap.isOpened()):
        count = count + 1
        ret, frame = cap.read()
	if flag and count == 1000:
	    frame1= frame
	    flag = False
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
	gray  = gray[0:720, 0:1280]
	lower_blue = np.array([0, 0, 80])     ##[R value, G value, B value]
	upper_blue = np.array([130, 130, 255]) 
	mask = cv2.inRange(gray, lower_blue, upper_blue)
	masked_image = np.copy(frame)
	masked_image[mask != 0] = [0, 0, 0]
	background_image = frame1
	background_image = cv2.cvtColor(background_image, cv2.COLOR_BGR2RGB)
	crop_background = background_image[0:720, 0:1280]

	crop_background[mask == 0] = [0, 0, 0]

        final_image = crop_background + masked_image
        cv2.imshow('frame',final_image)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()


def show_webcam(mirror=False):
    cam = cv2.VideoCapture(0)
    while True:
        ret_val, img = cam.read()
        if mirror: 
            img = cv2.flip(img, 1)
        cv2.imshow('webcam', img)
	image_copy = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
#	cv2.imshow('webcam1',image_copy)
        if cv2.waitKey(1) == 27: 
            break  # esc to quit
    cv2.destroyAllWindows()

def image_test():
    image = cv2.imread("../masked.png")
    kernel = np.ones((15,15),np.float32)/225
    lower = np.array([1,1,1])
    upper = np.array([255,255,255])
    mask = cv2.inRange(image, lower, upper)
    res = cv2.bitwise_and(image,image, mask= mask)
    smoothed = cv2.filter2D(res,-1,kernel)

 
    cv2.imshow('masked',smoothed)
    while True:
	if cv2.waitKey(1) == 27:
            break  # esc to quit
def main():
#    show_webcam(mirror=True)
#    show_video()
    image_test()
if __name__ == '__main__':
    main()
