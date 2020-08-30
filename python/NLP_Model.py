import numpy as np
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Dropout, Embedding
from tensorflow.keras.callbacks import ModelCheckpoint
import sys
from random import randrange


class TextGenerator:
    def __init__(self):
        pass

    def setProj(self, in_text):
        # lower the input
        self.input = in_text
        for i, val in enumerate(self.input):
            self.input[i] = val.lower()
        # start tokenizer and apply it on the input
        self.tokenizer = Tokenizer()
        self.tokenizer.fit_on_texts(self.input)
        self.enc_data = self.tokenizer.texts_to_sequences(self.input)
        self.size_of_vocab = len(self.tokenizer.word_counts) + 1
        # taking the encoded data and organizing it into a sequence that'll fit the model
        sequences = []
        for text in self.enc_data:
            length = len(text)
            for id in range(1,length):
                sequences.append(text[:id+1])
        self.max_len = max([len(seq) for seq in sequences])
        # padding the sequences to make them the same length
        self.sequences = pad_sequences(sequences, maxlen=self.max_len, padding='pre')
        self.sequences = np.array(self.sequences)
        # splitting data into x train and y train
        self.x = self.sequences[:,:-1]
        self.y = self.sequences[:,-1]
        # sorting y for a categorical label
        self.y = to_categorical(self.y,num_classes=self.size_of_vocab)
        # creating the model - an LSTM nn that has the following layers:
        self.model = Sequential()
        self.model.add(Embedding(self.size_of_vocab,10,input_length=self.max_len))
        self.model.add(LSTM(50))
        self.model.add(Dropout(0.1))
        self.model.add(Dense(self.size_of_vocab,activation='softmax'))
        self.model.compile(loss='categorical_crossentropy',optimizer='adam')

    def train(self, cp_path, epochs=525):
        # simply fitting the model to the x and y training data
        callback = ModelCheckpoint(
        filepath=cp_path,
        verbose=1,
        save_weights_only=True
            )
        self.model.fit(self.x,self.y,epochs=epochs,callbacks=[callback])

    def predict(self, in_text, num_words, PadOffset=False):
        # predicting the rest of a sequence according to the text given and the length needed
        pred = []
        if type(in_text) != list:
            in_text = [in_text]
        for base in in_text:
            for _ in range(num_words):
                enc_data = self.tokenizer.texts_to_sequences([base])[0]
                if PadOffset:
                    pad_data = pad_sequences([enc_data],padding='pre',maxlen=self.max_len)
                else:
                    pad_data = pad_sequences([enc_data],padding='pre',maxlen=self.max_len-1)
                y_prediction = np.argmax(self.model.predict(pad_data),axis=-1)
                out_word = ''
                for text, ind in self.tokenizer.word_index.items():
                    if ind == y_prediction:
                        out_word = text
                        break
                base += ' ' + out_word
            pred.append(base)
        return pred


def sort_data(path):
    # sorts the data txt file so that it'll be without the tag at the start
    out = []
    flile = open(path,'r',encoding="utf8").read().split('\n')
    for text in flile:
        text = text.split()[1:]
        out.append(' '.join(text))
    return out


if __name__ == "__main__":
    # setting up the cp path and the model dictionary
    checkpoint_path = 'python/{}.ckpt'
    gens = {"christmas": TextGenerator(), "bday": TextGenerator(), "luck": TextGenerator(), "getWell": TextGenerator(), "anniversary": TextGenerator()}
    # FOR DEV USE:
    # tag = "christmas"
    # FOR DEV USE - the following for loop is the part that trains the bot. When you're finished training, COMMENT IT OUT!!
    #for tag in gens:
    #    print(tag)
    #   gens[tag].train(checkpoint_path.format(tag), epochs=525)
    # FOR DEV USE - the following is the manual loading of the model and predicting the output.
    #   gens[tag].model.load_weights(checkpoint_path.format(tag))
    #   print(gens[tag].predict("Wow, you are",randrange(8, 30)))
    # recieving input from the js script and outoputting the corresponding prediction
    gens[sys.argv[1].split()[0]].setProj(sort_data(f'python/{sys.argv[1].split()[0]}.txt'))
    gens[sys.argv[1].split()[0]].model.load_weights(checkpoint_path.format(sys.argv[1].split()[0]))
    print(gens[sys.argv[1].split()[0]].predict(" ".join(sys.argv[1].split()[1:]),randrange(5, 50),PadOffset = (sys.argv[1].split()[0] == "birthday")))
