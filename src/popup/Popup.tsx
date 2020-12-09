import React, { useEffect, useState } from "react";
import RefreshIcon from '@material-ui/icons/Refresh';
import { format, render, cancel, register } from 'timeago.js';

import "./Popup.scss";

interface FeedItem {
  link: string; created_at: string; username: string; tweet: string;
}

type API = (username: string) => Promise<FeedItem[]>;

const tempServer: API = (username) => {
  return Promise.resolve([
  {'tweet': 'I definitely dont forgive an I play it back in my head everyday I kno niggas aint my homies an I been koo with that Ill let you ride with what you think you kno bout me', 'created_at': '2020-12-09 12:02:18', 'link': 'https://twitter.com/welchjr20/status/1336506532612235267?s=20', 'username': 'welchjr20'},
  {'tweet': 'Im sorry you use to talking to idiots but you should be able to tell just how stupid a nigga is by the conversation he  can carry', 'created_at': '2020-12-09 07:09:18', 'link': 'https://twitter.com/welchjr20/status/1336434605218476036?s=20', 'username': 'welchjr20'},
  {'tweet': 'Hes been out for 5 years and oh—isn’t a white supremacist or traitor. Damn.', 'created_at': '2020-12-08 12:23:38', 'link': 'https://twitter.com/semperdiced/status/1336285306731917312', 'username': 'semperdiced'}, 
  {'tweet': '@yekayuriy54 These people are so fucked and heretical lmfao', 'created_at': '2020-12-08 08:39:34', 'link': 'https://twitter.com/DataRacist/status/1336228919381471233', 'username': 'dataracist'}, 
  {'tweet': 'Niggas envy me cuz they could never Fuck wit me its to much', 'created_at': '2020-12-08 05:57:23', 'link': 'https://twitter.com/welchjr20/status/1336188102558117889', 'username': 'welchjr20'}, 
  {'tweet': '@deetheevirgo \\U0001f9e2 tap in', 'created_at': '2020-12-08 05:42:16', 'link': 'https://twitter.com/welchjr20/status/1336184300048240641', 'username': 'welchjr20'}, 
  {'tweet': 'Hes a Russian asset.', 'created_at': '2020-12-08 05:29:28', 'link': 'https://twitter.com/semperdiced/status/1336181075362500609', 'username': 'semperdiced'}, 
  {'tweet': 'Georgia is watching @BrianKempGA, @GeoffDuncanGA, and @GaSecofState!  https://t.co/8R8rH8aV9U', 'created_at': '2020-12-08 05:15:48', 'link': 'https://twitter.com/realDonaldTrump/status/1336177638528983041', 'username': 'realdonaldtrump'}, 
  {'tweet': 'Damn Marc.  Got them shook.', 'created_at': '2020-12-08 03:00:02', 'link': 'https://twitter.com/semperdiced/status/1336143469266399233', 'username': 'semperdiced'}, {'tweet': '@JackMc185 @glennkirschner2 I’d feel safe.', 'created_at': '2020-12-08 02:24:19', 'link': 'https://twitter.com/semperdiced/status/1336134484249333760', 'username': 'semperdiced'}, 
  {'tweet': 'Holy smokes', 'created_at': '2020-12-08 02:17:20', 'link': 'https://twitter.com/semperdiced/status/1336132724281622529', 'username': 'semperdiced'}, 
  {'tweet': 'Ivanka Trump and Jared Kushner have splashed out on a $30 million-plus dollar lot of land on Miamis uber-swanky and high-security Indian Creek Island — known as the “Billionaire’s Bunker” — Page Six can exclusively reveal.    https://t.co/L49rw0q5r8', 'created_at': '2020-12-08 02:15:54', 'link': 'https://twitter.com/semperdiced/status/1336132364670390273', 'username': 'semperdiced'}]);
}

const realServer: API = (username) => {
  return fetch('http://aria.sparcs.org:11300/feeds?username='+username).then(r => r.json()).then(r => r['data']);
};

const KEY_USERNAME = 'USERNAME';

const realUserStorage: {
  fetchUser: () => Promise<string>,
  saveUser: (userName: string) => void,
  removeUser: () => void
} = {
  fetchUser: () => {
    return new Promise<string>((resolve, _) => {
      chrome.storage.local.get([KEY_USERNAME], (result) => {
        resolve(result[KEY_USERNAME]);
      });
    });
  },
  saveUser: (username) => {
    chrome.storage.local.set({
      [KEY_USERNAME]: username
    });
  },
  removeUser: () => {
    chrome.storage.local.remove([KEY_USERNAME]);
  },
};


const gotoURL = (link: string) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tab = tabs[0];
    chrome.tabs.update(tab.id, { url: link });
  });
}

const usePersistentUserData = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [myUserName, setMyUserName] = useState<string | undefined>(undefined);

  useEffect(() => {
    realUserStorage.fetchUser().then(userName => {
      setMyUserName(userName);
      setIsLoading(false);
    });
  });

  const signIn = (myUserName: string) => {
    setMyUserName(myUserName);
    realUserStorage.saveUser(myUserName);
  };

  const signOut = () => {
    setMyUserName(undefined);
    realUserStorage.removeUser();
  };

  return { isLoading, myUserName, signIn, signOut };
};

const LoadingPage: React.FC<{ signIn: (userName: string) => void }> = ({ signIn }) => {

  const [errorMessage, setErrorMessage] = useState('');

  const [checked, setChecked] = useState<boolean>(false);

  return <div style={{ boxSizing: 'border-box', width: '100%', height: '100%', padding: 24, display: 'flex', flexDirection: 'column' }}>
    <div className="header">
      <img src="Icon_Racism.png"></img>
      <h1>RacismGuard</h1>
    </div>
    <div>
      <div style={{ fontSize: 20 }}> <strong>Racism Awareness Pledge</strong></div>
      <p style={{ fontSize: 14 }}>
        Users with this badge pledge to be aware of racism and take part in raising sensitivity to
        this issue. In accordance to the pledge, you agree that your postings and comments are collected by RacismGuard
        for detecting and notifying any racist remarks, plus open to any feedback and discussion about these remarks from other users.
        They may politely inform you why the remark is discriminating,
        so that you could be more conscious of your usage of diction and not misuse racist words or phrases.
        </p>
    </div>
    <div style={{ fontSize: 16 }}>
      Twitter UserName:  <input id="username" autoComplete="off" />
      <div>
        I agree with the above terms.
        <input type="checkbox" id="checkbox" checked={checked} onChange={(e) => {
          setChecked(e.target.checked);
        }} />
      </div>
    </div>
    <div className="errorMessage">
      {errorMessage}
    </div>
    <button className="submit" onClick={() => {
      const el = document.getElementById('username') as HTMLInputElement;
      if (el.value.length === 0) {
        setErrorMessage('Please type in your Twitter userName');
        return;
      }
      if (!checked) {
        setErrorMessage('Please agree with the terms');
        return;
      }
      setErrorMessage('');
      signIn(el.value);
    }}>
      Submit
  </button>
  </div>;
}

const FeedPage: React.FC<{ myUserName: string, signOut: () => void }> = ({ myUserName, signOut }) => {

  const [list, setList] = useState<FeedItem[]>([]);

  const [refreshedWhen, setRefreshedWhen] = useState<string>('');

  const fetchFeed = () => {
    realServer(myUserName).then((list => setList(list)));
    setRefreshedWhen(new Date().toString().split('GMT')[0]);
  }

  useEffect(() => {
    fetchFeed();
  }, []);
  return <div style={{ boxSizing: 'border-box', width: '100%', height: '100%', padding: 24, display: 'flex', flexDirection: 'column' }}>
    <div className="header">
      <img src="Icon_Racism.png"></img>
      <h1>RacismGuard</h1>
    </div>

    <div className="userInfo">
      <div>Hello, <i>{myUserName}</i>!</div>
      <button className="signout" onClick={signOut}>sign out</button>
    </div>
    <div className="badgeInfo">
      <h4>Your Racism-Awareness Badge is </h4><h3>ON</h3>
      <img src="anti-racism-badge.jpeg"></img>
    </div>
    <div className="feedInfo">
      <div style={{ fontSize: 24 }}>Feed
      <RefreshIcon onClick={fetchFeed} />
      </div>
      <div style={{ fontSize: 14, cursor: 'pointer' }}>{refreshedWhen}</div>
    </div>
    <div className="feed">
      {list.map(el => (
        <div>
          <a href={"#"} onClick={() => gotoURL(el.link)} style={{ cursor: 'pointer', fontSize: 16 }}>{el.tweet}</a><br />
          <div style={{ color: '#A0A0A0', fontSize: 14 }} >
            by {el.username} {format(new Date(el.created_at))}
          </div>
        </div>
      ))}
    </div>
  </div>
};

export default function Popup() {

  const { myUserName, signIn, signOut } = usePersistentUserData();

  return <div className="popupContainer">
    {
      (
        myUserName !== undefined
          ? <FeedPage myUserName={myUserName} signOut={signOut} />
          : <LoadingPage signIn={signIn} />
      )
    }
  </div>;
}
