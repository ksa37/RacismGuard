import React, { useEffect, useState } from "react";
import RefreshIcon from '@material-ui/icons/Refresh';

import "./Popup.scss";

interface FeedItem {
  userName: string; tweet: string; tweetUrl: string
}

type API = (userName: string) => Promise<FeedItem[]>;

const fakeServer: API = (userName) => {
  return Promise.resolve([
    {
      userName: 'racist',
      tweet: 'xxx is black',
      tweetUrl: 'https://twitter.com/racismguard/status/1333606092849377280?s=20'
    },
    {
      userName: 'racist',
      tweet: 'xxx is yellow',
      tweetUrl: 'https://twitter.com/racismguard/status/1333606092849377280?s=20'
    },
    {
      userName: 'racist',
      tweet: 'uhhahahahaha I am such a racist',
      tweetUrl: 'https://twitter.com/racismguard/status/1333606092849377280?s=20'
    },
    {
      userName: 'racist',
      tweet: 'nigga nigga nigga',
      tweetUrl: 'https://twitter.com/racismguard/status/1333606092849377280?s=20'
    },
    {
      userName: 'racist',
      tweet: 'xxx is black',
      tweetUrl: 'https://twitter.com/racismguard/status/1333606092849377280?s=20'
    },
    {
      userName: 'racist',
      tweet: 'xxxx is yellow',
      tweetUrl: 'https://twitter.com/racismguard/status/1333606092849377280?s=20'
    },
    {
      userName: 'racist',
      tweet: 'uhhahahahaha I am such a racist',
      tweetUrl: 'https://twitter.com/racismguard/status/1333606092849377280?s=20'
    },
    {
      userName: 'racist',
      tweet: 'nigga nigga nigga',
      tweetUrl: 'https://twitter.com/racismguard/status/1333606092849377280?s=20'
    }

  ]);
}

const realServer: API = (userName) => {
  return fetch('http://localhost:8080/feeds?userName=' + userName)
    .then(r => r.json());
};

const fakeUserStorage = {
  fetchUser: () => {
    return Promise.resolve('mandoo');
  }
}

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
  saveUser: (userName) => {
    chrome.storage.local.set({
      [KEY_USERNAME]: userName
    });
  },
  removeUser: () => {
    chrome.storage.local.remove([KEY_USERNAME]);
  },
};


const gotoURL = (tweetUrl: string) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tab = tabs[0];
    chrome.tabs.update(tab.id, { url: tweetUrl });
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
      Twitter UserName:  <input id="username" autoComplete="off"/>
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
        setErrorMessage('Please type in your Twitter username');
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
    fakeServer(myUserName)
      .then(list => setList(list));
    setRefreshedWhen(new Date().toISOString());
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
        <a href={"#"} onClick={() => gotoURL(el.tweetUrl)} style={{ cursor: 'pointer' }}>{el.tweet}</a><br />
        <div style={{ color: '#A0A0A0', fontSize: 14 }} >
          by {el.userName} xxxx times ago
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
