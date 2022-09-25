from venv import create
import cv2
import sys
import os
import os.path
capture_on = False
createImageFalg = False
capture_type = ''
cam = None


face_classifier = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def onCam():
    global cam
    if (cam is None):
        #리눅스
        #cam = cv2.VideoCapture(cv2.CAP_V4L2)
        #윈도우
        #cam = cv2.VideoCapture(2)
        cam = cv2.VideoCapture(0)
        print(cam)
        cam.set(cv2.CAP_PROP_FRAME_WIDTH, 500)
        cam.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        print('onCam 파이썬 : 카메라 켜짐')
        return True
    return True


def closeCam():
    global cam
    if (cam is not None):
        print('cloaseCam :카메라꺼짐')
        cam.release()
        cam = None
    # print('cloase cam')
    # if (cam != NULL): 
    #     cam.release()
    #     cam = NULL


def face_extractor(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(gray, 1.3, 5)

    #찾는 얼굴이 없으면 None Return
    if faces is():
        return None
    for (x, y, w, h) in faces:
        #print("w : " + w "+ h :" + h)
        cropped_face = img[y:y+h, x:x+w]
    return cropped_face


def createCropImage(userName, dir_path, countN):
    global cam
    onCam()
   # if(cam == None):
   #     onCam()
    #    print('1 if(cam == None):')
   # elif(cam != None):
    #    print('2 elif(cam != None):')
    #    if not cam.isOpened():
    #        print('2-2 if not cam.isOpened():')
    #        onCam()
   # else:
    #    print("3 createImage")

    #print("현재 위치" + str(os.getcwdb()))
    dir_path = os.path.join(dir_path, userName)
    count = 0
    #폴더 생성
    if not (os.path.exists(dir_path)):
        os.mkdir(dir_path)
        print(dir_path + "폴더생성 완료")
    
    print("4 cam.isOpened() 전 ")
    if(cam.isOpened()):
        print("5 cam.isOpened() 통과")
        while True:
            ret, frame = cam.read()
            if face_extractor(frame) is not None:
                count += 1
                face = cv2.resize(face_extractor(frame), (160, 160))
                face = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
                file_name_path = str(count) + '.jpg'
                #크롭된 이미지 저장
                #face/login/user
                cv2.imwrite(dir_path + '/'+file_name_path, face)
            else:
                print("Face not Found")
                pass

            if cv2.waitKey(1) == 13 or count == countN:
                break

        cv2.destroyAllWindows()
        return dir_path
