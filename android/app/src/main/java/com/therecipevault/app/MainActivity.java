package com.therecipevault.app;

import android.os.Bundle;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.WebViewListener;

public class MainActivity extends BridgeActivity {
    private boolean fallbackLoaded = false;
    private boolean remotePageLoaded = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        bridgeBuilder.addWebViewListener(new WebViewListener() {
            @Override
            public void onPageLoaded(WebView webView) {
                if (getBridge() == null) return;
                String currentUrl = webView.getUrl();
                String localBaseUrl = getLocalBaseUrl();
                if (currentUrl != null && !currentUrl.startsWith(localBaseUrl)) {
                    remotePageLoaded = true;
                }
            }

            @Override
            public void onReceivedError(WebView webView) {
                fallbackToLocalAssets(webView);
            }
        });
        super.onCreate(savedInstanceState);
    }

    private String getLocalBaseUrl() {
        return getBridge().getScheme() + "://" + getBridge().getHost() + "/";
    }

    private void fallbackToLocalAssets(WebView webView) {
        if (fallbackLoaded || remotePageLoaded || getBridge() == null) return;
        String currentUrl = webView.getUrl();
        String localBaseUrl = getLocalBaseUrl();
        if (currentUrl == null || !currentUrl.startsWith(localBaseUrl)) {
            fallbackLoaded = true;
            webView.post(() -> webView.loadUrl(localBaseUrl));
        }
    }
}
