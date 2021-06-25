(function(){
    var script = {
 "layout": "absolute",
 "start": "this.playAudioList([this.audio_542EC97F_4116_B9F0_41BA_9725F3FBD932]); this.init(); this.syncPlaylists([this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist,this.mainPlayList])",
 "scrollBarWidth": 10,
 "id": "rootPlayer",
 "mobileMipmappingEnabled": false,
 "vrPolyfillScale": 0.5,
 "propagateClick": false,
 "scrollBarColor": "#000000",
 "desktopMipmappingEnabled": false,
 "mouseWheelEnabled": true,
 "scrollBarOpacity": 0.5,
 "children": [
  "this.MainViewer",
  "this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6",
  "this.Container_28F13815_3EC9_4D25_41A4_1E0C9958B241",
  "this.HTMLText_28DD875F_3FC6_C326_41BF_7D45B160689E"
 ],
 "borderSize": 0,
 "paddingRight": 0,
 "backgroundPreloadEnabled": true,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 20,
 "defaultVRPointer": "laser",
 "scripts": {
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "existsKey": function(key){  return key in window; },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "unregisterKey": function(key){  delete window[key]; },
  "registerKey": function(key, value){  window[key] = value; },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "getKey": function(key){  return window[key]; }
 },
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "minWidth": 20,
 "verticalAlign": "top",
 "horizontalAlign": "left",
 "height": "100%",
 "gap": 10,
 "paddingTop": 0,
 "buttonToggleMute": "this.IconButton_28F16815_3EC9_4D25_4185_80C785F90BD5",
 "downloadEnabled": false,
 "paddingBottom": 0,
 "borderRadius": 0,
 "shadow": false,
 "class": "Player",
 "data": {
  "name": "Player461"
 },
 "overflow": "visible",
 "definitions": [{
 "class": "Video",
 "label": "6",
 "scaleMode": "fit_inside",
 "thumbnailUrl": "media/video_5004ED5E_4136_D930_41C4_B8A563F1EEF1_t.jpg",
 "width": 960,
 "loop": false,
 "id": "video_5004ED5E_4136_D930_41C4_B8A563F1EEF1",
 "height": 540,
 "video": {
  "width": 960,
  "class": "VideoResource",
  "height": 540,
  "mp4Url": "media/video_5004ED5E_4136_D930_41C4_B8A563F1EEF1.mp4"
 }
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 51.75,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_54CD3E61_4119_5B13_41B2_81A330AD67E3"
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "media": "this.panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "media": "this.panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "media": "this.panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "media": "this.panorama_32D513E4_3E49_431B_41C0_F94602EC1E99",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "media": "this.panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "media": "this.panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "media": "this.panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "VideoPlayListItem",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.mainPlayList, 7, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.mainPlayList, 7)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer); this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "media": "this.video_4CE82A45_412B_5B13_41CE_B98B96DB4D6D",
   "player": "this.MainViewerVideoPlayer"
  },
  {
   "class": "VideoPlayListItem",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.mainPlayList, 8, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.mainPlayList, 8)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer); this.setEndToItemIndex(this.mainPlayList, 8, 9)",
   "media": "this.video_4E799513_4129_6930_41BA_171DB18B9BCA",
   "player": "this.MainViewerVideoPlayer"
  },
  {
   "class": "VideoPlayListItem",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.mainPlayList, 9, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.mainPlayList, 9)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer); this.setEndToItemIndex(this.mainPlayList, 9, 10)",
   "media": "this.video_4EE97EFF_413F_78EF_41A9_45A0BF0DCEF2",
   "player": "this.MainViewerVideoPlayer"
  },
  {
   "class": "VideoPlayListItem",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.mainPlayList, 10, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.mainPlayList, 10)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer); this.setEndToItemIndex(this.mainPlayList, 10, 11)",
   "media": "this.video_51D67874_4139_67F1_41C6_0655D8BFD596",
   "player": "this.MainViewerVideoPlayer"
  },
  {
   "class": "VideoPlayListItem",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.mainPlayList, 11, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.mainPlayList, 11)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer); this.setEndToItemIndex(this.mainPlayList, 11, 12)",
   "media": "this.video_5004ED5E_4136_D930_41C4_B8A563F1EEF1",
   "player": "this.MainViewerVideoPlayer"
  },
  {
   "class": "VideoPlayListItem",
   "end": "this.trigger('tourEnded')",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer); this.setEndToItemIndex(this.mainPlayList, 12, 0)",
   "media": "this.video_51E957C6_4129_A911_41B8_57096AC01F8A",
   "player": "this.MainViewerVideoPlayer",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.mainPlayList, 12, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.mainPlayList, 12)"
  }
 ],
 "id": "mainPlayList"
},
{
 "class": "MediaAudio",
 "audio": {
  "class": "AudioResource",
  "mp3Url": "media/audio_52EF3431_411E_AF70_41AE_35E6A1A028A3.mp3",
  "oggUrl": "media/audio_52EF3431_411E_AF70_41AE_35E6A1A028A3.ogg"
 },
 "autoplay": true,
 "id": "audio_52EF3431_411E_AF70_41AE_35E6A1A028A3",
 "data": {
  "label": "Nose Cone"
 }
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "VideoPlayListItem",
   "start": "this.viewer_uid5526FD7A_4119_59F0_41B0_AEAAAD8CE51EVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.playList_55273D7A_4119_59F0_41CA_87E6A4EF9CAD, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.playList_55273D7A_4119_59F0_41CA_87E6A4EF9CAD, 0)",
   "begin": "this.fixTogglePlayPauseButton(this.viewer_uid5526FD7A_4119_59F0_41B0_AEAAAD8CE51EVideoPlayer)",
   "media": "this.video_5004ED5E_4136_D930_41C4_B8A563F1EEF1",
   "player": "this.viewer_uid5526FD7A_4119_59F0_41B0_AEAAAD8CE51EVideoPlayer"
  }
 ],
 "id": "playList_55273D7A_4119_59F0_41CA_87E6A4EF9CAD"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -140.54,
  "pitch": -11.1
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_camera"
},
{
 "class": "Video",
 "label": "2_sport",
 "scaleMode": "fit_inside",
 "thumbnailUrl": "media/video_4CE82A45_412B_5B13_41CE_B98B96DB4D6D_t.jpg",
 "width": 960,
 "loop": false,
 "id": "video_4CE82A45_412B_5B13_41CE_B98B96DB4D6D",
 "height": 540,
 "video": {
  "width": 960,
  "class": "VideoResource",
  "height": 540,
  "mp4Url": "media/video_4CE82A45_412B_5B13_41CE_B98B96DB4D6D.mp4"
 }
},
{
 "class": "MediaAudio",
 "audio": {
  "class": "AudioResource",
  "mp3Url": "media/audio_5256E541_4116_A910_418C_B7AA39A4136B.mp3",
  "oggUrl": "media/audio_5256E541_4116_A910_418C_B7AA39A4136B.ogg"
 },
 "autoplay": true,
 "id": "audio_5256E541_4116_A910_418C_B7AA39A4136B",
 "data": {
  "label": "Side Wall Packaging"
 }
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -176.83,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_54976E18_4119_5B31_41BC_BB225E865849"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 3.17,
   "backwardYaw": -173.86,
   "distance": 1,
   "panorama": "this.panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -179.74,
   "backwardYaw": -109.41,
   "distance": 1,
   "panorama": "this.panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC"
  }
 ],
 "hfov": 360,
 "partial": false,
 "hfovMin": "150%",
 "id": "panorama_32D513E4_3E49_431B_41C0_F94602EC1E99",
 "thumbnailUrl": "media/panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_t.jpg",
 "label": "59",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_tcap0",
  "this.overlay_2C7924D4_3E47_C53A_41C7_28ADA68F94BD",
  "this.overlay_28E37B42_3ECA_C31E_4184_F5BB6FE93698",
  "this.overlay_51A6D96C_4139_5910_41BC_589CB621F6DB"
 ]
},
{
 "class": "Photo",
 "duration": 5000,
 "id": "photo_50AA91D3_412F_E930_41CF_B9DDE8CF7CC1",
 "thumbnailUrl": "media/photo_50AA91D3_412F_E930_41CF_B9DDE8CF7CC1_t.jpg",
 "width": 602,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/photo_50AA91D3_412F_E930_41CF_B9DDE8CF7CC1.jpg",
    "class": "ImageResourceLevel"
   }
  ]
 },
 "height": 602
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -179.93,
   "backwardYaw": 0.88,
   "distance": 1,
   "panorama": "this.panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9"
  }
 ],
 "hfov": 360,
 "label": "55",
 "hfovMin": "151%",
 "id": "panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3",
 "thumbnailUrl": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_t.jpg",
 "audios": [
  "this.audio_55CFD6F9_41EE_A8F0_41CB_FE193B5D30EC"
 ],
 "pitch": 0,
 "partial": false,
 "hfovMax": 125,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "width": 1536,
      "height": 1536
     },
     {
      "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "width": 1536,
      "height": 1536
     },
     {
      "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "width": 1536,
      "height": 1536
     },
     {
      "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "width": 1536,
      "height": 1536
     },
     {
      "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "width": 1536,
      "height": 1536
     },
     {
      "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "width": 1536,
      "height": 1536
     },
     {
      "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_tcap0",
  "this.overlay_2F5FB43D_3E7F_456A_41C8_4A8CA76F85EE",
  "this.overlay_277FE3FE_3FC9_42E6_41C1_351AB4013EEC"
 ]
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 7.19,
   "backwardYaw": -128.25,
   "distance": 1,
   "panorama": "this.panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB"
  }
 ],
 "hfov": 360,
 "partial": false,
 "hfovMin": "150%",
 "id": "panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4",
 "thumbnailUrl": "media/panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_t.jpg",
 "label": "60",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_tcap0",
  "this.overlay_2B8065CB_3ECB_472E_4198_93C795F05F32",
  "this.overlay_50D66438_412E_AF70_41C8_8CCEC8EEB7C8"
 ]
},
{
 "class": "Video",
 "label": "4",
 "scaleMode": "fit_inside",
 "thumbnailUrl": "media/video_51D67874_4139_67F1_41C6_0655D8BFD596_t.jpg",
 "width": 960,
 "loop": false,
 "id": "video_51D67874_4139_67F1_41C6_0655D8BFD596",
 "height": 540,
 "video": {
  "width": 960,
  "class": "VideoResource",
  "height": 540,
  "mp4Url": "media/video_51D67874_4139_67F1_41C6_0655D8BFD596.mp4"
 }
},
{
 "closeButtonPressedIconColor": "#FFFFFF",
 "backgroundColorRatios": [],
 "data": {
  "name": "Window2041"
 },
 "bodyPaddingRight": 5,
 "id": "window_4D156A87_40EB_FB10_41CA_7D9147CC78CD",
 "bodyBackgroundColorDirection": "vertical",
 "width": 400,
 "scrollBarColor": "#000000",
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "bodyPaddingTop": 5,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "headerVerticalAlign": "middle",
 "scrollBarVisible": "rollOver",
 "bodyBackgroundOpacity": 1,
 "scrollBarOpacity": 0.5,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "titlePaddingLeft": 5,
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "minHeight": 20,
 "verticalAlign": "middle",
 "titleFontColor": "#000000",
 "veilColorRatios": [
  0,
  1
 ],
 "backgroundColor": [],
 "bodyPaddingBottom": 5,
 "veilColorDirection": "horizontal",
 "minWidth": 20,
 "titleFontSize": "1.29vmin",
 "modal": true,
 "headerBackgroundColorDirection": "vertical",
 "height": 600,
 "title": "Side Wall Assembly",
 "titleFontWeight": "normal",
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "closeButtonBackgroundColor": [],
 "backgroundOpacity": 1,
 "shadowSpread": 1,
 "titlePaddingTop": 5,
 "class": "Window",
 "closeButtonRollOverIconColor": "#FFFFFF",
 "headerBorderSize": 0,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "overflow": "scroll",
 "veilOpacity": 0.4,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "headerPaddingRight": 10,
 "shadow": true,
 "layout": "vertical",
 "propagateClick": false,
 "footerBackgroundColorDirection": "vertical",
 "children": [
  "this.viewer_uid55205D76_4119_59F0_41CA_47E70BEACE82",
  "this.htmlText_4D155A87_40EB_FB10_4184_0482A8E87ABC"
 ],
 "veilShowEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "titlePaddingRight": 5,
 "closeButtonIconHeight": 12,
 "bodyBorderSize": 0,
 "shadowColor": "#000000",
 "footerHeight": 5,
 "borderSize": 0,
 "paddingRight": 0,
 "titleFontStyle": "normal",
 "titleFontFamily": "Arial",
 "backgroundColorDirection": "vertical",
 "headerPaddingBottom": 10,
 "closeButtonIconColor": "#000000",
 "headerBorderColor": "#000000",
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "headerPaddingTop": 10,
 "headerPaddingLeft": 10,
 "veilHideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "closeButtonBorderRadius": 11,
 "shadowBlurRadius": 6,
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "shadowHorizontalLength": 3,
 "gap": 10,
 "titleTextDecoration": "none",
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "closeButtonBackgroundColorRatios": [],
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "headerBackgroundOpacity": 1,
 "bodyBorderColor": "#000000",
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "bodyPaddingLeft": 5,
 "closeButtonIconLineWidth": 2,
 "paddingBottom": 0,
 "close": "this.playList_55209D75_4119_59F0_41C7_ED335BC5BAEA.set('selectedIndex', -1);",
 "paddingTop": 0,
 "borderRadius": 5,
 "titlePaddingBottom": 5,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "shadowOpacity": 0.5,
 "scrollBarWidth": 10,
 "closeButtonIconWidth": 12,
 "shadowVerticalLength": 0
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "hfov": 120,
  "class": "PanoramaCameraPosition",
  "yaw": 0.21,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_54A29E2A_4119_5B11_41C1_65DFE7B11CAF"
},
{
 "class": "Video",
 "label": "5",
 "scaleMode": "fit_inside",
 "thumbnailUrl": "media/video_4E799513_4129_6930_41BA_171DB18B9BCA_t.jpg",
 "width": 960,
 "loop": false,
 "id": "video_4E799513_4129_6930_41BA_171DB18B9BCA",
 "height": 540,
 "video": {
  "width": 960,
  "class": "VideoResource",
  "height": 540,
  "mp4Url": "media/video_4E799513_4129_6930_41BA_171DB18B9BCA.mp4"
 }
},
{
 "closeButtonPressedIconColor": "#FFFFFF",
 "backgroundColorRatios": [],
 "data": {
  "name": "Window56072"
 },
 "bodyPaddingRight": 5,
 "id": "window_26D11E4C_3FCF_452A_41C2_EE0CC659FA84",
 "bodyBackgroundColorDirection": "vertical",
 "width": 400,
 "scrollBarColor": "#000000",
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "bodyPaddingTop": 5,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "headerVerticalAlign": "middle",
 "scrollBarVisible": "rollOver",
 "bodyBackgroundOpacity": 1,
 "scrollBarOpacity": 0.5,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "titlePaddingLeft": 5,
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "minHeight": 20,
 "verticalAlign": "middle",
 "titleFontColor": "#000000",
 "veilColorRatios": [
  0,
  1
 ],
 "backgroundColor": [],
 "veilColorDirection": "horizontal",
 "minWidth": 20,
 "titleFontSize": "5vmin",
 "modal": true,
 "headerBackgroundColorDirection": "vertical",
 "height": 600,
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "title": "Side Wall ",
 "titleFontWeight": "bold",
 "shadowSpread": 1,
 "closeButtonBackgroundColor": [],
 "backgroundOpacity": 1,
 "headerBorderSize": 0,
 "bodyPaddingBottom": 5,
 "titlePaddingTop": 5,
 "class": "Window",
 "closeButtonRollOverIconColor": "#FFFFFF",
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "overflow": "scroll",
 "veilOpacity": 0.4,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "headerPaddingRight": 10,
 "shadow": true,
 "layout": "vertical",
 "propagateClick": false,
 "footerBackgroundColorDirection": "vertical",
 "children": [
  "this.image_uid551FED72_4119_59F0_41C2_EF5E5B4ED315_0",
  "this.htmlText_26D32E4C_3FCF_452A_41B0_268B69616981"
 ],
 "veilShowEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "titlePaddingRight": 5,
 "closeButtonIconHeight": 12,
 "bodyBorderSize": 0,
 "shadowColor": "#000000",
 "footerHeight": 5,
 "borderSize": 0,
 "paddingRight": 0,
 "titleFontStyle": "normal",
 "titleFontFamily": "Arial",
 "backgroundColorDirection": "vertical",
 "headerPaddingBottom": 10,
 "closeButtonIconColor": "#000000",
 "headerBorderColor": "#000000",
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "headerPaddingTop": 10,
 "headerPaddingLeft": 10,
 "veilHideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "closeButtonBorderRadius": 11,
 "shadowBlurRadius": 6,
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "shadowHorizontalLength": 3,
 "gap": 10,
 "titleTextDecoration": "none",
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "closeButtonBackgroundColorRatios": [],
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "headerBackgroundOpacity": 1,
 "bodyBorderColor": "#000000",
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "bodyPaddingLeft": 5,
 "closeButtonIconLineWidth": 2,
 "paddingBottom": 0,
 "paddingTop": 0,
 "borderRadius": 5,
 "titlePaddingBottom": 5,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "shadowOpacity": 0.5,
 "scrollBarWidth": 10,
 "closeButtonIconWidth": 12,
 "shadowVerticalLength": 0
},
{
 "closeButtonPressedIconColor": "#FFFFFF",
 "backgroundColorRatios": [],
 "data": {
  "name": "Window7991"
 },
 "bodyPaddingRight": 5,
 "id": "window_519246F6_413B_A8F0_41CB_C88E33C1578B",
 "bodyBackgroundColorDirection": "vertical",
 "width": 400,
 "scrollBarColor": "#000000",
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "bodyPaddingTop": 5,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "headerVerticalAlign": "middle",
 "scrollBarVisible": "rollOver",
 "bodyBackgroundOpacity": 1,
 "scrollBarOpacity": 0.5,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "titlePaddingLeft": 5,
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "minHeight": 20,
 "verticalAlign": "middle",
 "titleFontColor": "#000000",
 "veilColorRatios": [
  0,
  1
 ],
 "backgroundColor": [],
 "bodyPaddingBottom": 5,
 "veilColorDirection": "horizontal",
 "minWidth": 20,
 "titleFontSize": "1.29vmin",
 "modal": true,
 "headerBackgroundColorDirection": "vertical",
 "height": 600,
 "title": "Roof Assembely ",
 "titleFontWeight": "normal",
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "closeButtonBackgroundColor": [],
 "backgroundOpacity": 1,
 "shadowSpread": 1,
 "titlePaddingTop": 5,
 "class": "Window",
 "closeButtonRollOverIconColor": "#FFFFFF",
 "headerBorderSize": 0,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "overflow": "scroll",
 "veilOpacity": 0.4,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "headerPaddingRight": 10,
 "shadow": true,
 "layout": "vertical",
 "propagateClick": false,
 "footerBackgroundColorDirection": "vertical",
 "children": [
  "this.viewer_uid55246D79_4119_59F0_41CA_AFFA551DC046",
  "this.htmlText_5190B6FB_413B_A8F0_41CA_ED5E4E52E1F2"
 ],
 "veilShowEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "titlePaddingRight": 5,
 "closeButtonIconHeight": 12,
 "bodyBorderSize": 0,
 "shadowColor": "#000000",
 "footerHeight": 5,
 "borderSize": 0,
 "paddingRight": 0,
 "titleFontStyle": "normal",
 "titleFontFamily": "Arial",
 "backgroundColorDirection": "vertical",
 "headerPaddingBottom": 10,
 "closeButtonIconColor": "#000000",
 "headerBorderColor": "#000000",
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "headerPaddingTop": 10,
 "headerPaddingLeft": 10,
 "veilHideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "closeButtonBorderRadius": 11,
 "shadowBlurRadius": 6,
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "shadowHorizontalLength": 3,
 "gap": 10,
 "titleTextDecoration": "none",
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "closeButtonBackgroundColorRatios": [],
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "headerBackgroundOpacity": 1,
 "bodyBorderColor": "#000000",
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "bodyPaddingLeft": 5,
 "closeButtonIconLineWidth": 2,
 "paddingBottom": 0,
 "close": "this.playList_55245D79_4119_59F0_4176_40F2E531D4C6.set('selectedIndex', -1);",
 "paddingTop": 0,
 "borderRadius": 5,
 "titlePaddingBottom": 5,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "shadowOpacity": 0.5,
 "scrollBarWidth": 10,
 "closeButtonIconWidth": 12,
 "shadowVerticalLength": 0
},
{
 "class": "MediaAudio",
 "audio": {
  "class": "AudioResource",
  "mp3Url": "media/audio_527DBAF6_4119_D8F1_41C5_1F75C39A7685.mp3",
  "oggUrl": "media/audio_527DBAF6_4119_D8F1_41C5_1F75C39A7685.ogg"
 },
 "autoplay": true,
 "id": "audio_527DBAF6_4119_D8F1_41C5_1F75C39A7685",
 "data": {
  "label": "Sport Welding"
 }
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0.26,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_54AFDE3B_4119_5B77_41A2_FC05B0BC201E"
},
{
 "class": "PanoramaAudio",
 "audio": {
  "class": "AudioResource",
  "mp3Url": "media/audio_55CFD6F9_41EE_A8F0_41CB_FE193B5D30EC.mp3",
  "oggUrl": "media/audio_55CFD6F9_41EE_A8F0_41CB_FE193B5D30EC.ogg"
 },
 "autoplay": true,
 "id": "audio_55CFD6F9_41EE_A8F0_41CB_FE193B5D30EC",
 "data": {
  "label": "welcome"
 }
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 158.02,
   "backwardYaw": 3.8,
   "distance": 1,
   "panorama": "this.panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -128.25,
   "backwardYaw": 7.19,
   "distance": 1,
   "panorama": "this.panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4"
  }
 ],
 "hfov": 360,
 "partial": false,
 "hfovMin": "163%",
 "id": "panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB",
 "thumbnailUrl": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_t.jpg",
 "label": "64",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_tcap0",
  "this.overlay_2AAED8E4_3E39_4D1A_4148_963768075F18",
  "this.overlay_2A5C0501_3EC9_C71A_41C7_6A4F28B247A7",
  "this.overlay_517F27F6_4136_A8F0_41CE_38A321902597",
  "this.overlay_51A8D454_412A_AF30_41CA_009FCA3B3883",
  "this.overlay_5146695F_4129_5930_41C6_50EF8FC2D025"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "hfov": 120,
  "class": "PanoramaCameraPosition",
  "yaw": -179.12,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_5575BDE6_4119_5910_41C6_8803F68CE2B4"
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "VideoPlayListItem",
   "start": "this.viewer_uid55205D76_4119_59F0_41CA_47E70BEACE82VideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.playList_55209D75_4119_59F0_41C7_ED335BC5BAEA, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.playList_55209D75_4119_59F0_41C7_ED335BC5BAEA, 0)",
   "begin": "this.fixTogglePlayPauseButton(this.viewer_uid55205D76_4119_59F0_41CA_47E70BEACE82VideoPlayer)",
   "media": "this.video_4CE82A45_412B_5B13_41CE_B98B96DB4D6D",
   "player": "this.viewer_uid55205D76_4119_59F0_41CA_47E70BEACE82VideoPlayer"
  }
 ],
 "id": "playList_55209D75_4119_59F0_41C7_ED335BC5BAEA"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_camera"
},
{
 "class": "Video",
 "label": "1_laser",
 "scaleMode": "fit_inside",
 "thumbnailUrl": "media/video_51E957C6_4129_A911_41B8_57096AC01F8A_t.jpg",
 "width": 960,
 "loop": false,
 "id": "video_51E957C6_4129_A911_41B8_57096AC01F8A",
 "height": 540,
 "video": {
  "width": 960,
  "class": "VideoResource",
  "height": 540,
  "mp4Url": "media/video_51E957C6_4129_A911_41B8_57096AC01F8A.mp4"
 }
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -179.79,
   "backwardYaw": 12.83,
   "distance": 1,
   "panorama": "this.panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 0.88,
   "backwardYaw": -179.93,
   "distance": 1,
   "panorama": "this.panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3"
  }
 ],
 "hfov": 360,
 "label": "56",
 "hfovMin": "150%",
 "id": "panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9",
 "thumbnailUrl": "media/panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_tcap0",
  "this.overlay_2FD5C2D7_3E7A_DD26_41C8_A3B685FF60AD",
  "this.overlay_2FCE3EED_3E7B_C2E5_41CB_0FA4D221546F",
  "this.overlay_24A894DA_3E59_452E_41A0_F19BD7EADA0B"
 ]
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist, 0, 1)",
   "media": "this.panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist, 1, 2)",
   "media": "this.panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist, 2, 3)",
   "media": "this.panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist, 3, 4)",
   "media": "this.panorama_32D513E4_3E49_431B_41C0_F94602EC1E99",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist, 4, 5)",
   "media": "this.panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist, 5, 6)",
   "media": "this.panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist, 6, 7)",
   "media": "this.panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "VideoPlayListItem",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist, 7, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist, 7)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer); this.setEndToItemIndex(this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist, 7, 8)",
   "media": "this.video_4CE82A45_412B_5B13_41CE_B98B96DB4D6D",
   "player": "this.MainViewerVideoPlayer"
  },
  {
   "class": "VideoPlayListItem",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist, 8, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist, 8)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer); this.setEndToItemIndex(this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist, 8, 9)",
   "media": "this.video_4E799513_4129_6930_41BA_171DB18B9BCA",
   "player": "this.MainViewerVideoPlayer"
  },
  {
   "class": "VideoPlayListItem",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist, 9, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist, 9)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer); this.setEndToItemIndex(this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist, 9, 10)",
   "media": "this.video_4EE97EFF_413F_78EF_41A9_45A0BF0DCEF2",
   "player": "this.MainViewerVideoPlayer"
  },
  {
   "class": "VideoPlayListItem",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist, 10, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist, 10)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer); this.setEndToItemIndex(this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist, 10, 11)",
   "media": "this.video_51D67874_4139_67F1_41C6_0655D8BFD596",
   "player": "this.MainViewerVideoPlayer"
  },
  {
   "class": "VideoPlayListItem",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist, 11, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist, 11)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer); this.setEndToItemIndex(this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist, 11, 12)",
   "media": "this.video_5004ED5E_4136_D930_41C4_B8A563F1EEF1",
   "player": "this.MainViewerVideoPlayer"
  },
  {
   "class": "VideoPlayListItem",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist, 12, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist, 12)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer); this.setEndToItemIndex(this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist, 12, 0)",
   "media": "this.video_51E957C6_4129_A911_41B8_57096AC01F8A",
   "player": "this.MainViewerVideoPlayer"
  }
 ],
 "id": "ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist"
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "VideoPlayListItem",
   "start": "this.viewer_uid55230D77_4119_59F0_41A6_AA611E2454BBVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.playList_55237D77_4119_59F0_41C4_AA4AA89FDC94, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.playList_55237D77_4119_59F0_41C4_AA4AA89FDC94, 0)",
   "begin": "this.fixTogglePlayPauseButton(this.viewer_uid55230D77_4119_59F0_41A6_AA611E2454BBVideoPlayer)",
   "media": "this.video_4E799513_4129_6930_41BA_171DB18B9BCA",
   "player": "this.viewer_uid55230D77_4119_59F0_41A6_AA611E2454BBVideoPlayer"
  }
 ],
 "id": "playList_55237D77_4119_59F0_41C4_AA4AA89FDC94"
},
{
 "class": "MediaAudio",
 "audio": {
  "class": "AudioResource",
  "mp3Url": "media/audio_54C0C2CB_4119_AB10_41CB_65625EA58891.mp3",
  "oggUrl": "media/audio_54C0C2CB_4119_AB10_41CB_65625EA58891.ogg"
 },
 "autoplay": true,
 "id": "audio_54C0C2CB_4119_AB10_41CB_65625EA58891",
 "data": {
  "label": "Laser welding"
 }
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "VideoPlayListItem",
   "start": "this.viewer_uid55246D79_4119_59F0_41CA_AFFA551DC046VideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.playList_55245D79_4119_59F0_4176_40F2E531D4C6, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.playList_55245D79_4119_59F0_4176_40F2E531D4C6, 0)",
   "begin": "this.fixTogglePlayPauseButton(this.viewer_uid55246D79_4119_59F0_41CA_AFFA551DC046VideoPlayer)",
   "media": "this.video_51D67874_4139_67F1_41C6_0655D8BFD596",
   "player": "this.viewer_uid55246D79_4119_59F0_41CA_AFFA551DC046VideoPlayer"
  }
 ],
 "id": "playList_55245D79_4119_59F0_4176_40F2E531D4C6"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -167.17,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_55487D9F_4119_5930_41C5_7B45359AE106"
},
{
 "class": "MediaAudio",
 "audio": {
  "class": "AudioResource",
  "mp3Url": "media/audio_525F2300_4116_A910_419F_74CC26318838.mp3",
  "oggUrl": "media/audio_525F2300_4116_A910_419F_74CC26318838.ogg"
 },
 "autoplay": true,
 "id": "audio_525F2300_4116_A910_419F_74CC26318838",
 "data": {
  "label": "Side Wall Assembly"
 }
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -176.2,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_557EFDF7_4119_58F0_41A8_1CF6A71B2966"
},
{
 "closeButtonPressedIconColor": "#FFFFFF",
 "backgroundColorRatios": [],
 "data": {
  "name": "Window13045"
 },
 "bodyPaddingRight": 5,
 "id": "window_5068CCE5_4129_5F10_41C8_01FDDACE7953",
 "bodyBackgroundColorDirection": "vertical",
 "width": 400,
 "scrollBarColor": "#000000",
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "bodyPaddingTop": 5,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "headerVerticalAlign": "middle",
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "titlePaddingLeft": 5,
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "minHeight": 20,
 "verticalAlign": "middle",
 "titleFontColor": "#000000",
 "veilColorRatios": [
  0,
  1
 ],
 "backgroundColor": [],
 "bodyPaddingBottom": 5,
 "veilColorDirection": "horizontal",
 "minWidth": 20,
 "titleFontSize": "1.29vmin",
 "modal": true,
 "headerBackgroundColorDirection": "vertical",
 "height": 600,
 "title": "Laser Welding",
 "titleFontWeight": "normal",
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "closeButtonBackgroundColor": [],
 "backgroundOpacity": 1,
 "shadowSpread": 1,
 "titlePaddingTop": 5,
 "class": "Window",
 "closeButtonRollOverIconColor": "#FFFFFF",
 "headerBorderSize": 0,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "overflow": "scroll",
 "veilOpacity": 0.4,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "headerPaddingRight": 10,
 "shadow": true,
 "layout": "vertical",
 "propagateClick": false,
 "footerBackgroundColorDirection": "vertical",
 "children": [
  "this.viewer_uid5528DD7C_4119_59F0_41CF_26098DE92B7E",
  "this.htmlText_506AFCE5_4129_5F10_41A8_3C3F7485FEB0"
 ],
 "veilShowEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "titlePaddingRight": 5,
 "closeButtonIconHeight": 12,
 "shadowColor": "#000000",
 "footerHeight": 5,
 "borderSize": 0,
 "paddingRight": 0,
 "titleFontStyle": "normal",
 "titleFontFamily": "Arial",
 "backgroundColorDirection": "vertical",
 "headerPaddingBottom": 10,
 "closeButtonIconColor": "#000000",
 "headerBorderColor": "#000000",
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "headerPaddingTop": 10,
 "headerPaddingLeft": 10,
 "veilHideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "closeButtonBorderRadius": 11,
 "shadowBlurRadius": 6,
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "shadowHorizontalLength": 3,
 "gap": 10,
 "titleTextDecoration": "none",
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "closeButtonBackgroundColorRatios": [],
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "headerBackgroundOpacity": 1,
 "close": "this.playList_55291D7C_4119_59F0_41CB_385A94BB6B19.set('selectedIndex', -1);",
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "bodyPaddingLeft": 5,
 "closeButtonIconLineWidth": 2,
 "paddingBottom": 0,
 "paddingTop": 0,
 "borderRadius": 5,
 "titlePaddingBottom": 5,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "shadowOpacity": 0.5,
 "scrollBarWidth": 10,
 "closeButtonIconWidth": 12,
 "shadowVerticalLength": 0
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "hfov": 114,
  "class": "PanoramaCameraPosition",
  "yaw": 168.36,
  "pitch": -6.78
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_camera",
 "manualRotationSpeed": 1775
},
{
 "closeButtonPressedIconColor": "#FFFFFF",
 "backgroundColorRatios": [],
 "data": {
  "name": "Window5684"
 },
 "bodyPaddingRight": 5,
 "id": "window_5188DF6B_4137_7910_41C9_B0B5137C905C",
 "bodyBackgroundColorDirection": "vertical",
 "width": 400,
 "scrollBarColor": "#000000",
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "bodyPaddingTop": 5,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "headerVerticalAlign": "middle",
 "scrollBarVisible": "rollOver",
 "bodyBackgroundOpacity": 1,
 "scrollBarOpacity": 0.5,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "titlePaddingLeft": 5,
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "minHeight": 20,
 "verticalAlign": "middle",
 "titleFontColor": "#000000",
 "veilColorRatios": [
  0,
  1
 ],
 "backgroundColor": [],
 "bodyPaddingBottom": 5,
 "veilColorDirection": "horizontal",
 "minWidth": 20,
 "titleFontSize": "1.29vmin",
 "modal": true,
 "headerBackgroundColorDirection": "vertical",
 "height": 600,
 "title": "Side Wall Packaging",
 "titleFontWeight": "normal",
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "closeButtonBackgroundColor": [],
 "backgroundOpacity": 1,
 "shadowSpread": 1,
 "titlePaddingTop": 5,
 "class": "Window",
 "closeButtonRollOverIconColor": "#FFFFFF",
 "headerBorderSize": 0,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "overflow": "scroll",
 "veilOpacity": 0.4,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "headerPaddingRight": 10,
 "shadow": true,
 "layout": "vertical",
 "propagateClick": false,
 "footerBackgroundColorDirection": "vertical",
 "children": [
  "this.viewer_uid55230D77_4119_59F0_41A6_AA611E2454BB",
  "this.htmlText_51886F6B_4137_7910_41C6_832E86AB3B84"
 ],
 "veilShowEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "titlePaddingRight": 5,
 "closeButtonIconHeight": 12,
 "bodyBorderSize": 0,
 "shadowColor": "#000000",
 "footerHeight": 5,
 "borderSize": 0,
 "paddingRight": 0,
 "titleFontStyle": "normal",
 "titleFontFamily": "Arial",
 "backgroundColorDirection": "vertical",
 "headerPaddingBottom": 10,
 "closeButtonIconColor": "#000000",
 "headerBorderColor": "#000000",
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "headerPaddingTop": 10,
 "headerPaddingLeft": 10,
 "veilHideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "closeButtonBorderRadius": 11,
 "shadowBlurRadius": 6,
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "shadowHorizontalLength": 3,
 "gap": 10,
 "titleTextDecoration": "none",
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "closeButtonBackgroundColorRatios": [],
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "headerBackgroundOpacity": 1,
 "bodyBorderColor": "#000000",
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "bodyPaddingLeft": 5,
 "closeButtonIconLineWidth": 2,
 "paddingBottom": 0,
 "close": "this.playList_55237D77_4119_59F0_41C4_AA4AA89FDC94.set('selectedIndex', -1);",
 "paddingTop": 0,
 "borderRadius": 5,
 "titlePaddingBottom": 5,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "shadowOpacity": 0.5,
 "scrollBarWidth": 10,
 "closeButtonIconWidth": 12,
 "shadowVerticalLength": 0
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 123.2,
  "pitch": -8.66
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_camera"
},
{
 "class": "MediaAudio",
 "audio": {
  "class": "AudioResource",
  "mp3Url": "media/audio_542EC97F_4116_B9F0_41BA_9725F3FBD932.mp3",
  "oggUrl": "media/audio_542EC97F_4116_B9F0_41BA_9725F3FBD932.ogg"
 },
 "autoplay": true,
 "id": "audio_542EC97F_4116_B9F0_41BA_9725F3FBD932",
 "data": {
  "label": "background.mp4"
 }
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "VideoPlayListItem",
   "start": "this.viewer_uid55259D78_4119_59F0_41C7_04C3A608C132VideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.playList_55222D78_4119_59F0_4170_6A434AB7BB89, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.playList_55222D78_4119_59F0_4170_6A434AB7BB89, 0)",
   "begin": "this.fixTogglePlayPauseButton(this.viewer_uid55259D78_4119_59F0_41C7_04C3A608C132VideoPlayer)",
   "media": "this.video_4EE97EFF_413F_78EF_41A9_45A0BF0DCEF2",
   "player": "this.viewer_uid55259D78_4119_59F0_41C7_04C3A608C132VideoPlayer"
  }
 ],
 "id": "playList_55222D78_4119_59F0_4170_6A434AB7BB89"
},
{
 "gyroscopeEnabled": true,
 "class": "PanoramaPlayer",
 "buttonRestart": "this.IconButton_28F1F815_3EC9_4D25_41C1_2261F9203189",
 "buttonMoveRight": "this.IconButton_28F18815_3EC9_4D25_41BA_3F1D28B348E9",
 "displayPlaybackBar": true,
 "buttonZoomOut": "this.IconButton_28F21814_3EC9_4D3B_41B2_E02332748685",
 "touchControlMode": "drag_rotation",
 "id": "MainViewerPanoramaPlayer",
 "gyroscopeVerticalDraggingEnabled": true,
 "buttonPlayRight": "this.IconButton_28F17815_3EC9_4D25_41B4_CB4FD2FEA961",
 "viewerArea": "this.MainViewer",
 "buttonPlayLeft": "this.IconButton_28F1E815_3EC9_4D25_41CE_C6D2CA3828D5",
 "buttonZoomIn": "this.IconButton_28F14815_3EC9_4D25_41CE_B6CCF7A72026",
 "buttonMoveUp": "this.IconButton_28F1B815_3EC9_4D25_41A1_348BB1FD9351",
 "buttonMoveDown": "this.IconButton_28F19815_3EC9_4D25_41C7_52A989E1F255",
 "buttonPause": "this.IconButton_28F1A815_3EC9_4D25_41A8_4FEB479A2BB2",
 "buttonMoveLeft": "this.IconButton_28F1D815_3EC9_4D25_41A7_0311A21BA535",
 "mouseControlMode": "drag_acceleration"
},
{
 "closeButtonPressedIconColor": "#FFFFFF",
 "backgroundColorRatios": [],
 "data": {
  "name": "Window15663"
 },
 "bodyPaddingRight": 5,
 "id": "window_5309ED69_4179_7910_41A2_EE1907E4AF53",
 "bodyBackgroundColorDirection": "vertical",
 "width": 400,
 "scrollBarColor": "#000000",
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "bodyPaddingTop": 5,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "headerVerticalAlign": "middle",
 "scrollBarVisible": "rollOver",
 "bodyBackgroundOpacity": 1,
 "scrollBarOpacity": 0.5,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "titlePaddingLeft": 5,
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "minHeight": 20,
 "verticalAlign": "middle",
 "titleFontColor": "#000000",
 "veilColorRatios": [
  0,
  1
 ],
 "backgroundColor": [],
 "bodyPaddingBottom": 5,
 "veilColorDirection": "horizontal",
 "minWidth": 20,
 "titleFontSize": "1.29vmin",
 "modal": true,
 "headerBackgroundColorDirection": "vertical",
 "height": 600,
 "title": "Sport Welding ",
 "titleFontWeight": "normal",
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "closeButtonBackgroundColor": [],
 "backgroundOpacity": 1,
 "shadowSpread": 1,
 "titlePaddingTop": 5,
 "class": "Window",
 "closeButtonRollOverIconColor": "#FFFFFF",
 "headerBorderSize": 0,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "overflow": "scroll",
 "veilOpacity": 0.4,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "headerPaddingRight": 10,
 "shadow": true,
 "layout": "vertical",
 "propagateClick": false,
 "footerBackgroundColorDirection": "vertical",
 "children": [
  "this.viewer_uid55259D78_4119_59F0_41C7_04C3A608C132",
  "this.htmlText_53083D69_4179_7910_4192_ED9990ED76AB"
 ],
 "veilShowEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "titlePaddingRight": 5,
 "closeButtonIconHeight": 12,
 "bodyBorderSize": 0,
 "shadowColor": "#000000",
 "footerHeight": 5,
 "borderSize": 0,
 "paddingRight": 0,
 "titleFontStyle": "normal",
 "titleFontFamily": "Arial",
 "backgroundColorDirection": "vertical",
 "headerPaddingBottom": 10,
 "closeButtonIconColor": "#000000",
 "headerBorderColor": "#000000",
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "headerPaddingTop": 10,
 "headerPaddingLeft": 10,
 "veilHideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "closeButtonBorderRadius": 11,
 "shadowBlurRadius": 6,
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "shadowHorizontalLength": 3,
 "gap": 10,
 "titleTextDecoration": "none",
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "closeButtonBackgroundColorRatios": [],
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "headerBackgroundOpacity": 1,
 "bodyBorderColor": "#000000",
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "bodyPaddingLeft": 5,
 "closeButtonIconLineWidth": 2,
 "paddingBottom": 0,
 "close": "this.playList_55222D78_4119_59F0_4170_6A434AB7BB89.set('selectedIndex', -1);",
 "paddingTop": 0,
 "borderRadius": 5,
 "titlePaddingBottom": 5,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "shadowOpacity": 0.5,
 "scrollBarWidth": 10,
 "closeButtonIconWidth": 12,
 "shadowVerticalLength": 0
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -172.81,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_548A4E09_4119_5B10_41B5_1CEE307B818A"
},
{
 "class": "MediaAudio",
 "audio": {
  "class": "AudioResource",
  "mp3Url": "media/audio_53D0F507_416A_A910_41CD_2A56ECD6BC94.mp3",
  "oggUrl": "media/audio_53D0F507_416A_A910_41CD_2A56ECD6BC94.ogg"
 },
 "autoplay": true,
 "id": "audio_53D0F507_416A_A910_41CD_2A56ECD6BC94",
 "data": {
  "label": "Side_wall"
 }
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "hfov": 114,
  "class": "PanoramaCameraPosition",
  "yaw": 0.07,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_55533DB0_4119_5970_41BC_BC3AB2B7C1ED",
 "manualRotationSpeed": 1775
},
{
 "class": "Photo",
 "duration": 5000,
 "id": "photo_26735C10_3FD9_453A_41B2_8C989A082D52",
 "thumbnailUrl": "media/photo_26735C10_3FD9_453A_41B2_8C989A082D52_t.jpg",
 "width": 600,
 "label": "1",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/photo_26735C10_3FD9_453A_41B2_8C989A082D52.jpg",
    "class": "ImageResourceLevel"
   }
  ]
 },
 "height": 386
},
{
 "class": "MediaAudio",
 "audio": {
  "class": "AudioResource",
  "mp3Url": "media/audio_55C292A7_412A_EB10_41C3_97B64D1A545F.mp3",
  "oggUrl": "media/audio_55C292A7_412A_EB10_41C3_97B64D1A545F.ogg"
 },
 "autoplay": true,
 "id": "audio_55C292A7_412A_EB10_41C3_97B64D1A545F",
 "data": {
  "label": "Roof Assembely"
 }
},
{
 "class": "Video",
 "label": "3_roof_top",
 "scaleMode": "fit_inside",
 "thumbnailUrl": "media/video_4EE97EFF_413F_78EF_41A9_45A0BF0DCEF2_t.jpg",
 "width": 960,
 "loop": false,
 "id": "video_4EE97EFF_413F_78EF_41A9_45A0BF0DCEF2",
 "height": 540,
 "video": {
  "width": 960,
  "class": "VideoResource",
  "height": 540,
  "mp4Url": "media/video_4EE97EFF_413F_78EF_41A9_45A0BF0DCEF2.mp4"
 }
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "VideoPlayListItem",
   "start": "this.viewer_uid5528DD7C_4119_59F0_41CF_26098DE92B7EVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.playList_55291D7C_4119_59F0_41CB_385A94BB6B19, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.playList_55291D7C_4119_59F0_41CB_385A94BB6B19, 0)",
   "begin": "this.fixTogglePlayPauseButton(this.viewer_uid5528DD7C_4119_59F0_41CF_26098DE92B7EVideoPlayer)",
   "media": "this.video_51E957C6_4129_A911_41B8_57096AC01F8A",
   "player": "this.viewer_uid5528DD7C_4119_59F0_41CF_26098DE92B7EVideoPlayer"
  }
 ],
 "id": "playList_55291D7C_4119_59F0_41CB_385A94BB6B19"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "hfov": 120,
  "class": "PanoramaCameraPosition",
  "yaw": 178.19,
  "pitch": -3.69
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 70.59,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_5569CDD4_4119_5930_41B3_C9ADE471C1A6"
},
{
 "class": "MediaAudio",
 "audio": {
  "class": "AudioResource",
  "mp3Url": "media/audio_52F22322_411A_A910_41BD_A904B89D5427.mp3",
  "oggUrl": "media/audio_52F22322_411A_A910_41BD_A904B89D5427.ogg"
 },
 "autoplay": true,
 "id": "audio_52F22322_411A_A910_41BD_A904B89D5427",
 "data": {
  "label": "End Wall"
 }
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -163.18,
  "pitch": -6.96
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_camera"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -109.41,
   "backwardYaw": -179.74,
   "distance": 1,
   "panorama": "this.panorama_32D513E4_3E49_431B_41C0_F94602EC1E99"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 3.8,
   "backwardYaw": 158.02,
   "distance": 1,
   "panorama": "this.panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB"
  }
 ],
 "hfov": 360,
 "partial": false,
 "hfovMin": "150%",
 "id": "panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC",
 "thumbnailUrl": "media/panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_t.jpg",
 "label": "61",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_tcap0",
  "this.overlay_2A1E7FC1_3E3A_C31D_41C1_4899BFADA107",
  "this.overlay_2D5BFD57_3E3F_C726_41B9_E64C70ED3DFE",
  "this.overlay_51A04D0E_413A_B910_41BE_4D1CD2EEA76C"
 ]
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -173.86,
   "backwardYaw": 3.17,
   "distance": 1,
   "panorama": "this.panorama_32D513E4_3E49_431B_41C0_F94602EC1E99"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 12.83,
   "backwardYaw": -179.79,
   "distance": 1,
   "panorama": "this.panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9"
  }
 ],
 "hfov": 360,
 "partial": false,
 "hfovMin": "150%",
 "id": "panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F",
 "thumbnailUrl": "media/panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_t.jpg",
 "label": "58",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_tcap0",
  "this.overlay_2CAEFEF3_3E47_42FD_41B3_CFBD452C430A",
  "this.overlay_2FF10A18_3E49_CD2A_4163_FA8471C4F794",
  "this.overlay_4E350DDD_4129_B933_41C6_C9291A9AEC4A"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 70.14,
  "pitch": -0.16
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_camera"
},
{
 "closeButtonPressedIconColor": "#FFFFFF",
 "backgroundColorRatios": [],
 "data": {
  "name": "Window9485"
 },
 "bodyPaddingRight": 5,
 "id": "window_51DA2F03_4137_B917_41B8_E70315D298B8",
 "bodyBackgroundColorDirection": "vertical",
 "width": 400,
 "scrollBarColor": "#000000",
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "bodyPaddingTop": 5,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "headerVerticalAlign": "middle",
 "scrollBarVisible": "rollOver",
 "bodyBackgroundOpacity": 1,
 "scrollBarOpacity": 0.5,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "titlePaddingLeft": 5,
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "minHeight": 20,
 "verticalAlign": "middle",
 "titleFontColor": "#000000",
 "veilColorRatios": [
  0,
  1
 ],
 "backgroundColor": [],
 "bodyPaddingBottom": 5,
 "veilColorDirection": "horizontal",
 "minWidth": 20,
 "titleFontSize": "1.29vmin",
 "modal": true,
 "headerBackgroundColorDirection": "vertical",
 "height": 600,
 "title": "Roof Leak Testing",
 "titleFontWeight": "normal",
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "closeButtonBackgroundColor": [],
 "backgroundOpacity": 1,
 "shadowSpread": 1,
 "titlePaddingTop": 5,
 "class": "Window",
 "closeButtonRollOverIconColor": "#FFFFFF",
 "headerBorderSize": 0,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "overflow": "scroll",
 "veilOpacity": 0.4,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "headerPaddingRight": 10,
 "shadow": true,
 "layout": "vertical",
 "propagateClick": false,
 "footerBackgroundColorDirection": "vertical",
 "children": [
  "this.viewer_uid5526FD7A_4119_59F0_41B0_AEAAAD8CE51E",
  "this.htmlText_51DC0F03_4137_B917_41A9_CDDA20B3BDAD"
 ],
 "veilShowEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "titlePaddingRight": 5,
 "closeButtonIconHeight": 12,
 "bodyBorderSize": 0,
 "shadowColor": "#000000",
 "footerHeight": 5,
 "borderSize": 0,
 "paddingRight": 0,
 "titleFontStyle": "normal",
 "titleFontFamily": "Arial",
 "backgroundColorDirection": "vertical",
 "headerPaddingBottom": 10,
 "closeButtonIconColor": "#000000",
 "headerBorderColor": "#000000",
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "headerPaddingTop": 10,
 "headerPaddingLeft": 10,
 "veilHideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "closeButtonBorderRadius": 11,
 "shadowBlurRadius": 6,
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "shadowHorizontalLength": 3,
 "gap": 10,
 "titleTextDecoration": "none",
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "closeButtonBackgroundColorRatios": [],
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "headerBackgroundOpacity": 1,
 "bodyBorderColor": "#000000",
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "bodyPaddingLeft": 5,
 "closeButtonIconLineWidth": 2,
 "paddingBottom": 0,
 "close": "this.playList_55273D7A_4119_59F0_41CA_87E6A4EF9CAD.set('selectedIndex', -1);",
 "paddingTop": 0,
 "borderRadius": 5,
 "titlePaddingBottom": 5,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "shadowOpacity": 0.5,
 "scrollBarWidth": 10,
 "closeButtonIconWidth": 12,
 "shadowVerticalLength": 0
},
{
 "class": "MediaAudio",
 "audio": {
  "class": "AudioResource",
  "mp3Url": "media/audio_52C7B700_411B_6910_41C4_0046407FB4EB.mp3",
  "oggUrl": "media/audio_52C7B700_411B_6910_41C4_0046407FB4EB.ogg"
 },
 "autoplay": true,
 "id": "audio_52C7B700_411B_6910_41C4_0046407FB4EB",
 "data": {
  "label": "Roof Leak Testing"
 }
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 6.14,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_555DFDC2_4119_5910_41C2_F5673331CF4D"
},
{
 "class": "VideoPlayer",
 "buttonRestart": "this.IconButton_28F1F815_3EC9_4D25_41C1_2261F9203189",
 "buttonPause": "this.IconButton_28F1A815_3EC9_4D25_41A8_4FEB479A2BB2",
 "viewerArea": "this.MainViewer",
 "id": "MainViewerVideoPlayer",
 "displayPlaybackBar": true
},
{
 "closeButtonPressedIconColor": "#FFFFFF",
 "backgroundColorRatios": [],
 "data": {
  "name": "Window11660"
 },
 "bodyPaddingRight": 5,
 "id": "window_502ADFE8_4129_D910_41BD_7E0F6BE73760",
 "bodyBackgroundColorDirection": "vertical",
 "width": 400,
 "scrollBarColor": "#000000",
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "bodyPaddingTop": 5,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "headerVerticalAlign": "middle",
 "scrollBarVisible": "rollOver",
 "bodyBackgroundOpacity": 1,
 "scrollBarOpacity": 0.5,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "titlePaddingLeft": 5,
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "minHeight": 20,
 "verticalAlign": "middle",
 "titleFontColor": "#000000",
 "veilColorRatios": [
  0,
  1
 ],
 "backgroundColor": [],
 "veilColorDirection": "horizontal",
 "minWidth": 20,
 "titleFontSize": "1.29vmin",
 "modal": true,
 "headerBackgroundColorDirection": "vertical",
 "height": 600,
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "title": "End Wall",
 "titleFontWeight": "normal",
 "shadowSpread": 1,
 "closeButtonBackgroundColor": [],
 "backgroundOpacity": 1,
 "headerBorderSize": 0,
 "bodyPaddingBottom": 5,
 "titlePaddingTop": 5,
 "class": "Window",
 "closeButtonRollOverIconColor": "#FFFFFF",
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "overflow": "scroll",
 "veilOpacity": 0.4,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "headerPaddingRight": 10,
 "shadow": true,
 "layout": "vertical",
 "propagateClick": false,
 "footerBackgroundColorDirection": "vertical",
 "children": [
  "this.image_uid55266D7A_4119_59F0_418D_92FE91DFA462_0",
  "this.htmlText_50289FE9_4129_D910_41BC_15A2B39DCAC9"
 ],
 "veilShowEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "titlePaddingRight": 5,
 "closeButtonIconHeight": 12,
 "bodyBorderSize": 0,
 "shadowColor": "#000000",
 "footerHeight": 5,
 "borderSize": 0,
 "paddingRight": 0,
 "titleFontStyle": "normal",
 "titleFontFamily": "Arial",
 "backgroundColorDirection": "vertical",
 "headerPaddingBottom": 10,
 "closeButtonIconColor": "#000000",
 "headerBorderColor": "#000000",
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "headerPaddingTop": 10,
 "headerPaddingLeft": 10,
 "veilHideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "closeButtonBorderRadius": 11,
 "shadowBlurRadius": 6,
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "shadowHorizontalLength": 3,
 "gap": 10,
 "titleTextDecoration": "none",
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "closeButtonBackgroundColorRatios": [],
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "headerBackgroundOpacity": 1,
 "bodyBorderColor": "#000000",
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "bodyPaddingLeft": 5,
 "closeButtonIconLineWidth": 2,
 "paddingBottom": 0,
 "paddingTop": 0,
 "borderRadius": 5,
 "titlePaddingBottom": 5,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "shadowOpacity": 0.5,
 "scrollBarWidth": 10,
 "closeButtonIconWidth": 12,
 "shadowVerticalLength": 0
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -21.98,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_54BCEE4E_4119_5B11_4197_88E05710919F"
},
{
 "progressBarBorderColor": "#000000",
 "progressBackgroundColorDirection": "vertical",
 "id": "MainViewer",
 "left": 0,
 "playbackBarBottom": 5,
 "toolTipShadowSpread": 0,
 "playbackBarHeadOpacity": 1,
 "progressBorderColor": "#000000",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "toolTipBorderColor": "#000000",
 "width": "100%",
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "paddingLeft": 0,
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipFontSize": "3.98vmin",
 "toolTipOpacity": 1,
 "toolTipShadowBlurRadius": 3,
 "minHeight": 50,
 "toolTipTextShadowColor": "#FFFFFF",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "playbackBarRight": 0,
 "playbackBarHeight": 10,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowBlurRadius": 3,
 "toolTipPaddingBottom": 9,
 "minWidth": 100,
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "toolTipFontWeight": "normal",
 "height": "100%",
 "progressBarBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarBorderRadius": 0,
 "playbackBarHeadBorderRadius": 0,
 "transitionMode": "blending",
 "class": "ViewerArea",
 "playbackBarHeadBorderColor": "#000000",
 "toolTipShadowOpacity": 0,
 "progressLeft": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "shadow": false,
 "playbackBarBorderSize": 0,
 "propagateClick": false,
 "playbackBarBackgroundOpacity": 1,
 "toolTipFontStyle": "italic",
 "toolTipFontFamily": "Adobe Arabic",
 "vrPointerSelectionColor": "#FF6600",
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "borderSize": 0,
 "paddingRight": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadow": true,
 "progressBottom": 0,
 "toolTipBackgroundColor": "transparent",
 "toolTipFontColor": "#FFFFFF",
 "progressHeight": 10,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "top": 0,
 "playbackBarOpacity": 1,
 "displayTooltipInTouchScreens": true,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "toolTipBorderSize": 0,
 "toolTipPaddingTop": 27,
 "toolTipPaddingLeft": 21,
 "progressBorderRadius": 0,
 "paddingTop": 0,
 "toolTipDisplayTime": 600,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "paddingBottom": 0,
 "toolTipPaddingRight": 6,
 "toolTipBorderRadius": 0,
 "borderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "transitionDuration": 500,
 "data": {
  "name": "Main Viewer"
 }
},
{
 "itemThumbnailWidth": 75,
 "id": "ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6",
 "itemLabelFontStyle": "normal",
 "width": 131,
 "scrollBarColor": "#FFFFFF",
 "itemMode": "normal",
 "right": "3.86%",
 "itemLabelHorizontalAlign": "center",
 "itemThumbnailOpacity": 1,
 "scrollBarOpacity": 0.5,
 "itemPaddingRight": 3,
 "scrollBarVisible": "rollOver",
 "minHeight": 20,
 "paddingLeft": 20,
 "horizontalAlign": "left",
 "itemThumbnailShadowOpacity": 0.54,
 "verticalAlign": "top",
 "itemLabelFontFamily": "Arial",
 "minWidth": 20,
 "itemBorderRadius": 0,
 "height": "87.328%",
 "itemPaddingLeft": 3,
 "itemHorizontalAlign": "center",
 "itemLabelPosition": "bottom",
 "itemOpacity": 1,
 "selectedItemLabelFontColor": "#FFCC00",
 "itemThumbnailShadowSpread": 1,
 "itemBackgroundOpacity": 0,
 "backgroundOpacity": 0,
 "class": "ThumbnailList",
 "itemPaddingTop": 3,
 "itemThumbnailBorderRadius": 50,
 "itemBackgroundColor": [],
 "itemBackgroundColorRatios": [],
 "propagateClick": false,
 "layout": "vertical",
 "rollOverItemBackgroundOpacity": 0,
 "rollOverItemLabelFontWeight": "normal",
 "shadow": false,
 "itemThumbnailShadowHorizontalLength": 3,
 "borderSize": 0,
 "paddingRight": 20,
 "selectedItemLabelFontWeight": "bold",
 "itemLabelFontWeight": "normal",
 "itemLabelTextDecoration": "none",
 "playList": "this.ThumbnailList_2BFA9684_3EC9_451B_41C3_DA859B6C3CF6_playlist",
 "itemThumbnailShadowBlurRadius": 8,
 "itemThumbnailScaleMode": "fit_outside",
 "itemLabelFontSize": 14,
 "bottom": "5.68%",
 "itemVerticalAlign": "middle",
 "itemLabelFontColor": "#FFFFFF",
 "scrollBarMargin": 2,
 "gap": 10,
 "itemBackgroundColorDirection": "vertical",
 "itemThumbnailHeight": 75,
 "paddingTop": 10,
 "itemThumbnailShadow": true,
 "paddingBottom": 10,
 "borderRadius": 5,
 "itemPaddingBottom": 3,
 "data": {
  "name": "ThumbnailList35762"
 },
 "itemLabelGap": 9,
 "scrollBarWidth": 10,
 "itemThumbnailShadowVerticalLength": 3,
 "itemThumbnailShadowColor": "#000000"
},
{
 "propagateClick": false,
 "scrollBarWidth": 10,
 "id": "Container_28F13815_3EC9_4D25_41A4_1E0C9958B241",
 "left": "39.02%",
 "scrollBarColor": "#000000",
 "scrollBarOpacity": 0.5,
 "children": [
  "this.IconButton_28F21814_3EC9_4D3B_41B2_E02332748685",
  "this.IconButton_28F1F815_3EC9_4D25_41C1_2261F9203189",
  "this.IconButton_28F1E815_3EC9_4D25_41CE_C6D2CA3828D5",
  "this.IconButton_28F1D815_3EC9_4D25_41A7_0311A21BA535",
  "this.Container_28F1C815_3EC9_4D25_41CD_570B80F29BD2",
  "this.IconButton_28F18815_3EC9_4D25_41BA_3F1D28B348E9",
  "this.IconButton_28F17815_3EC9_4D25_41B4_CB4FD2FEA961",
  "this.IconButton_28F16815_3EC9_4D25_4185_80C785F90BD5",
  "this.IconButton_28F14815_3EC9_4D25_41CE_B6CCF7A72026"
 ],
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 20,
 "horizontalAlign": "center",
 "verticalAlign": "middle",
 "contentOpaque": false,
 "minWidth": 20,
 "height": 137,
 "bottom": "0.98%",
 "gap": 4,
 "scrollBarMargin": 2,
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "class": "Container",
 "data": {
  "name": "Container27661"
 },
 "overflow": "hidden",
 "shadow": false,
 "layout": "horizontal"
},
{
 "backgroundColorRatios": [
  0.73,
  1
 ],
 "scrollBarWidth": 10,
 "id": "HTMLText_28DD875F_3FC6_C326_41BF_7D45B160689E",
 "left": "1.33%",
 "scrollBarColor": "#000000",
 "shadowVerticalLength": 2,
 "shadowColor": "#000000",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingRight": 20,
 "paddingLeft": 20,
 "backgroundColorDirection": "vertical",
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "top": "2.19%",
 "width": "18.999%",
 "backgroundColor": [
  "#FFFFFF",
  "#CCCCCC"
 ],
 "minWidth": 1,
 "scrollBarMargin": 2,
 "height": "14.317%",
 "shadowBlurRadius": 7,
 "shadowHorizontalLength": 2,
 "paddingTop": 20,
 "shadowOpacity": 0.19,
 "paddingBottom": 10,
 "backgroundOpacity": 0.91,
 "shadowSpread": 1,
 "borderRadius": 10,
 "shadow": true,
 "class": "HTMLText",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#0099ff;font-size:25px;\"><B>Airflow</B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:13px;\"><B>Carbody Workshop</B></SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:12px;\"><BR STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:11px;\"><B>The Side Wall, Roofing, Nosecone,etc For Railway Coaches or Manufactured and Supplied to Indian Railways.</B></SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:12px;\"><BR STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"/></p><p STYLE=\"margin:0; line-height:12px;\"><BR STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"/></p></div>",
 "data": {
  "name": "HTMLText53815"
 },
 "propagateClick": false
},
{
 "transparencyActive": false,
 "propagateClick": false,
 "id": "IconButton_28F16815_3EC9_4D25_4185_80C785F90BD5",
 "width": 40,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "minHeight": 0,
 "verticalAlign": "middle",
 "iconURL": "skin/IconButton_28F16815_3EC9_4D25_4185_80C785F90BD5.png",
 "minWidth": 0,
 "mode": "toggle",
 "height": 40,
 "rollOverIconURL": "skin/IconButton_28F16815_3EC9_4D25_4185_80C785F90BD5_rollover.png",
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "pressedIconURL": "skin/IconButton_28F16815_3EC9_4D25_4185_80C785F90BD5_pressed.png",
 "class": "IconButton",
 "data": {
  "name": "Button27672"
 },
 "shadow": false,
 "cursor": "hand"
},
{
 "class": "VideoPlayer",
 "buttonRestart": "this.IconButton_28F1F815_3EC9_4D25_41C1_2261F9203189",
 "buttonPause": "this.IconButton_28F1A815_3EC9_4D25_41A8_4FEB479A2BB2",
 "viewerArea": "this.viewer_uid5526FD7A_4119_59F0_41B0_AEAAAD8CE51E",
 "id": "viewer_uid5526FD7A_4119_59F0_41B0_AEAAAD8CE51EVideoPlayer",
 "displayPlaybackBar": true
},
{
 "rotate": false,
 "class": "TripodCapPanoramaOverlay",
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_tcap0.png",
    "class": "ImageResourceLevel",
    "width": 1000,
    "height": 1000
   }
  ]
 },
 "hfov": 45,
 "id": "panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC, this.camera_5569CDD4_4119_5930_41B3_C9ADE471C1A6); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "toolTip": "Click Hear To Navigate"
  }
 ],
 "data": {
  "label": "Arrow Transparent Left"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 8.7,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_0_HS_1_0.png",
      "class": "ImageResourceLevel",
      "width": 160,
      "height": 152
     }
    ]
   },
   "pitch": -30.02,
   "yaw": -179.74
  }
 ],
 "id": "overlay_2C7924D4_3E47_C53A_41C7_28ADA68F94BD",
 "maps": [
  {
   "hfov": 8.7,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -179.74,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -30.02
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F, this.camera_555DFDC2_4119_5910_41C2_F5673331CF4D); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "toolTip": "Click Hear To Navigate"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 7.39,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_0_HS_2_0.png",
      "class": "ImageResourceLevel",
      "width": 121,
      "height": 120
     }
    ]
   },
   "pitch": -13.5,
   "yaw": 3.17
  }
 ],
 "id": "overlay_28E37B42_3ECA_C31E_4184_F5BB6FE93698",
 "maps": [
  {
   "hfov": 7.39,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 3.17,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -13.5
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showWindow(this.window_5309ED69_4179_7910_41A2_EE1907E4AF53, null, true); this.playList_55222D78_4119_59F0_4170_6A434AB7BB89.set('selectedIndex', 0); ; this.viewer_uid55259D78_4119_59F0_41C7_04C3A608C132VideoPlayer.play(); ; var src = this.playGlobalAudioWhilePlay(this.mainPlayList, 3, this.audio_527DBAF6_4119_D8F1_41C5_1F75C39A7685)",
   "mapColor": "#FF0000",
   "toolTip": "Sport Welding"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.54,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_0_HS_3_0.png",
      "class": "ImageResourceLevel",
      "width": 216,
      "height": 211
     }
    ]
   },
   "pitch": -0.52,
   "yaw": 77.74
  }
 ],
 "id": "overlay_51A6D96C_4139_5910_41BC_589CB621F6DB",
 "maps": [
  {
   "hfov": 13.54,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 77.74,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D513E4_3E49_431B_41C0_F94602EC1E99_0_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -0.52
  }
 ]
},
{
 "rotate": false,
 "class": "TripodCapPanoramaOverlay",
 "angle": 180,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_tcap0.png",
    "class": "ImageResourceLevel",
    "width": 1000,
    "height": 1000
   }
  ]
 },
 "hfov": 45,
 "id": "panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9, this.camera_5575BDE6_4119_5910_41C6_8803F68CE2B4); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "toolTip": "Click Hear To Navigate"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.49,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_0_HS_2_0.png",
      "class": "ImageResourceLevel",
      "width": 127,
      "height": 97
     }
    ]
   },
   "pitch": -20.57,
   "yaw": -179.93
  }
 ],
 "id": "overlay_2F5FB43D_3E7F_456A_41C8_4A8CA76F85EE",
 "maps": [
  {
   "hfov": 10.49,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -179.93,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 20,
      "height": 16
     }
    ]
   },
   "pitch": -20.57
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showWindow(this.window_26D11E4C_3FCF_452A_41C2_EE0CC659FA84, null, false); var src = this.playGlobalAudioWhilePlay(this.mainPlayList, 0, this.audio_53D0F507_416A_A910_41CD_2A56ECD6BC94)",
   "mapColor": "#FF0000",
   "toolTip": "Side Wall "
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.2,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_0_HS_3_0.png",
      "class": "ImageResourceLevel",
      "width": 116,
      "height": 134
     }
    ]
   },
   "pitch": 3.48,
   "yaw": 136.84
  }
 ],
 "id": "overlay_277FE3FE_3FC9_42E6_41C1_351AB4013EEC",
 "maps": [
  {
   "hfov": 10.2,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 136.84,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_0_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 18
     }
    ]
   },
   "pitch": 3.48
  }
 ]
},
{
 "rotate": false,
 "class": "TripodCapPanoramaOverlay",
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_tcap0.png",
    "class": "ImageResourceLevel",
    "width": 1000,
    "height": 1000
   }
  ]
 },
 "hfov": 45,
 "id": "panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB, this.camera_54CD3E61_4119_5B13_41B2_81A330AD67E3); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "toolTip": "Click Hear To Navigate"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 9.43,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_0_HS_3_0.png",
      "class": "ImageResourceLevel",
      "width": 153,
      "height": 152
     }
    ]
   },
   "pitch": -11.24,
   "yaw": 7.19
  }
 ],
 "id": "overlay_2B8065CB_3ECB_472E_4198_93C795F05F32",
 "maps": [
  {
   "hfov": 9.43,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 7.19,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_0_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -11.24
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showWindow(this.window_5068CCE5_4129_5F10_41C8_01FDDACE7953, null, true); this.playList_55291D7C_4119_59F0_41CB_385A94BB6B19.set('selectedIndex', 0); ; this.viewer_uid5528DD7C_4119_59F0_41CF_26098DE92B7EVideoPlayer.play(); ; var src = this.playGlobalAudioWhilePlay(this.mainPlayList, 6, this.audio_54C0C2CB_4119_AB10_41CB_65625EA58891)",
   "mapColor": "#FF0000",
   "toolTip": "Laser welding"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 15.25,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_0_HS_4_0.png",
      "class": "ImageResourceLevel",
      "width": 256,
      "height": 223
     }
    ]
   },
   "pitch": -18.23,
   "yaw": -131.78
  }
 ],
 "id": "overlay_50D66438_412E_AF70_41C8_8CCEC8EEB7C8",
 "maps": [
  {
   "hfov": 15.25,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -131.78,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4_0_HS_4_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 18,
      "height": 16
     }
    ]
   },
   "pitch": -18.23
  }
 ]
},
{
 "progressBarBorderColor": "#000000",
 "progressBackgroundColorDirection": "vertical",
 "id": "viewer_uid55205D76_4119_59F0_41CA_47E70BEACE82",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarBottom": 0,
 "toolTipShadowSpread": 0,
 "playbackBarHeadOpacity": 1,
 "progressBorderColor": "#000000",
 "toolTipBorderColor": "#767676",
 "width": "100%",
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "paddingLeft": 0,
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipFontSize": "1.11vmin",
 "toolTipOpacity": 1,
 "toolTipShadowBlurRadius": 3,
 "minHeight": 50,
 "toolTipTextShadowColor": "#000000",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "playbackBarRight": 0,
 "playbackBarHeight": 10,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowBlurRadius": 3,
 "toolTipPaddingBottom": 4,
 "minWidth": 100,
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "toolTipFontWeight": "normal",
 "height": "50%",
 "progressBarBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarBorderRadius": 0,
 "playbackBarHeadBorderRadius": 0,
 "transitionMode": "blending",
 "class": "ViewerArea",
 "playbackBarHeadBorderColor": "#000000",
 "toolTipShadowOpacity": 1,
 "progressLeft": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "shadow": false,
 "playbackBarBorderSize": 0,
 "toolTipShadowHorizontalLength": 0,
 "propagateClick": false,
 "playbackBarBackgroundOpacity": 1,
 "toolTipFontStyle": "normal",
 "toolTipFontFamily": "Arial",
 "toolTipShadowVerticalLength": 0,
 "vrPointerSelectionColor": "#FF6600",
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "borderSize": 0,
 "paddingRight": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadow": true,
 "progressBottom": 2,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "progressHeight": 10,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "displayTooltipInTouchScreens": true,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "toolTipBorderSize": 1,
 "toolTipPaddingTop": 4,
 "toolTipPaddingLeft": 6,
 "progressBorderRadius": 0,
 "paddingTop": 0,
 "toolTipDisplayTime": 600,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "paddingBottom": 0,
 "toolTipPaddingRight": 6,
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "transitionDuration": 500,
 "data": {
  "name": "ViewerArea29534"
 }
},
{
 "propagateClick": false,
 "id": "htmlText_4D155A87_40EB_FB10_4184_0482A8E87ABC",
 "scrollBarColor": "#000000",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingRight": 10,
 "paddingLeft": 10,
 "scrollBarVisible": "rollOver",
 "minHeight": 0,
 "width": "100%",
 "scrollBarMargin": 2,
 "minWidth": 0,
 "height": "50%",
 "paddingTop": 10,
 "paddingBottom": 10,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "class": "HTMLText",
 "data": {
  "name": "HTMLText2042"
 },
 "scrollBarWidth": 10,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\">Welding is a fabrication process that joins materials, usually metals or thermoplastics, by using high heat to melt the parts together and allowing them to cool, causing fusion. Welding is distinct from lower temperature metal-joining techniques such as brazing and soldering, which do not melt the base metal.</SPAN></DIV></div>"
},
{
 "propagateClick": false,
 "id": "image_uid551FED72_4119_59F0_41C2_EF5E5B4ED315_0",
 "width": "100%",
 "borderSize": 0,
 "paddingRight": 0,
 "url": "media/photo_26735C10_3FD9_453A_41B2_8C989A082D52.jpg",
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "minHeight": 0,
 "verticalAlign": "middle",
 "minWidth": 0,
 "height": "49%",
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "scaleMode": "fit_inside",
 "borderRadius": 0,
 "shadow": false,
 "class": "Image",
 "data": {
  "name": "Image29533"
 }
},
{
 "propagateClick": false,
 "id": "htmlText_26D32E4C_3FCF_452A_41B0_268B69616981",
 "scrollBarColor": "#000000",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingRight": 10,
 "paddingLeft": 10,
 "scrollBarVisible": "rollOver",
 "minHeight": 0,
 "width": "100%",
 "scrollBarMargin": 2,
 "minWidth": 0,
 "height": "50%",
 "paddingTop": 10,
 "paddingBottom": 10,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "class": "HTMLText",
 "data": {
  "name": "HTMLText56073"
 },
 "scrollBarWidth": 10,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\">The Fineshed Side wall Component is Packed and Ready for Despatch </SPAN></DIV></div>"
},
{
 "progressBarBorderColor": "#000000",
 "progressBackgroundColorDirection": "vertical",
 "id": "viewer_uid55246D79_4119_59F0_41CA_AFFA551DC046",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarBottom": 0,
 "toolTipShadowSpread": 0,
 "playbackBarHeadOpacity": 1,
 "progressBorderColor": "#000000",
 "toolTipBorderColor": "#767676",
 "width": "100%",
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "paddingLeft": 0,
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipFontSize": "1.11vmin",
 "toolTipOpacity": 1,
 "toolTipShadowBlurRadius": 3,
 "minHeight": 50,
 "toolTipTextShadowColor": "#000000",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "playbackBarRight": 0,
 "playbackBarHeight": 10,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowBlurRadius": 3,
 "toolTipPaddingBottom": 4,
 "minWidth": 100,
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "toolTipFontWeight": "normal",
 "height": "50%",
 "progressBarBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarBorderRadius": 0,
 "playbackBarHeadBorderRadius": 0,
 "transitionMode": "blending",
 "class": "ViewerArea",
 "playbackBarHeadBorderColor": "#000000",
 "toolTipShadowOpacity": 1,
 "progressLeft": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "shadow": false,
 "playbackBarBorderSize": 0,
 "toolTipShadowHorizontalLength": 0,
 "propagateClick": false,
 "playbackBarBackgroundOpacity": 1,
 "toolTipFontStyle": "normal",
 "toolTipFontFamily": "Arial",
 "toolTipShadowVerticalLength": 0,
 "vrPointerSelectionColor": "#FF6600",
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "borderSize": 0,
 "paddingRight": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadow": true,
 "progressBottom": 2,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "progressHeight": 10,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "displayTooltipInTouchScreens": true,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "toolTipBorderSize": 1,
 "toolTipPaddingTop": 4,
 "toolTipPaddingLeft": 6,
 "progressBorderRadius": 0,
 "paddingTop": 0,
 "toolTipDisplayTime": 600,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "paddingBottom": 0,
 "toolTipPaddingRight": 6,
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "transitionDuration": 500,
 "data": {
  "name": "ViewerArea29537"
 }
},
{
 "propagateClick": false,
 "id": "htmlText_5190B6FB_413B_A8F0_41CA_ED5E4E52E1F2",
 "scrollBarColor": "#000000",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingRight": 10,
 "paddingLeft": 10,
 "scrollBarVisible": "rollOver",
 "minHeight": 0,
 "width": "100%",
 "scrollBarMargin": 2,
 "minWidth": 0,
 "height": "50%",
 "paddingTop": 10,
 "paddingBottom": 10,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "class": "HTMLText",
 "data": {
  "name": "HTMLText7992"
 },
 "scrollBarWidth": 10,
 "html": "<div style=\"text-align:left; color:#000; \"><p STYLE=\"margin:0; line-height:12px;\"><BR STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"/></p></div>"
},
{
 "rotate": false,
 "class": "TripodCapPanoramaOverlay",
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_tcap0.png",
    "class": "ImageResourceLevel",
    "width": 1000,
    "height": 1000
   }
  ]
 },
 "hfov": 45,
 "id": "panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC, this.camera_557EFDF7_4119_58F0_41A8_1CF6A71B2966); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "toolTip": "Click Hear To Navigate"
  }
 ],
 "data": {
  "label": "Arrow Transparent Right-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 14.89,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0_HS_0_0.png",
      "class": "ImageResourceLevel",
      "width": 253,
      "height": 177
     }
    ]
   },
   "pitch": -19.82,
   "yaw": 158.02
  }
 ],
 "id": "overlay_2AAED8E4_3E39_4D1A_4148_963768075F18",
 "maps": [
  {
   "hfov": 14.89,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 158.02,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 22,
      "height": 16
     }
    ]
   },
   "pitch": -19.82
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_32D41BAE_3E49_4366_41CE_8DDC2F1B48D4, this.camera_548A4E09_4119_5B10_41B5_1CEE307B818A); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "toolTip": "Click Hear To Navigate"
  }
 ],
 "data": {
  "label": "Arrow Transparent Right"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 14.46,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0_HS_2_0.png",
      "class": "ImageResourceLevel",
      "width": 241,
      "height": 181
     }
    ]
   },
   "pitch": -16.42,
   "yaw": -128.25
  }
 ],
 "id": "overlay_2A5C0501_3EC9_C71A_41C7_6A4F28B247A7",
 "maps": [
  {
   "hfov": 14.46,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -128.25,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 21,
      "height": 16
     }
    ]
   },
   "pitch": -16.42
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showWindow(this.window_51DA2F03_4137_B917_41B8_E70315D298B8, null, true); this.playList_55273D7A_4119_59F0_41CA_87E6A4EF9CAD.set('selectedIndex', 0); ; this.viewer_uid5526FD7A_4119_59F0_41B0_AEAAAD8CE51EVideoPlayer.play(); ; var src = this.playGlobalAudioWhilePlay(this.mainPlayList, 5, this.audio_52C7B700_411B_6910_41C4_0046407FB4EB)",
   "mapColor": "#FF0000",
   "toolTip": "Roof Leak Testing"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 14.02,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0_HS_3_0.png",
      "class": "ImageResourceLevel",
      "width": 224,
      "height": 247
     }
    ]
   },
   "pitch": 3.37,
   "yaw": 69.2
  }
 ],
 "id": "overlay_517F27F6_4136_A8F0_41CE_38A321902597",
 "maps": [
  {
   "hfov": 14.02,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 69.2,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 17
     }
    ]
   },
   "pitch": 3.37
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.openLink('https://youtu.be/LUPxEuhhHug', '_blank'); var src = this.playGlobalAudioWhilePlay(this.mainPlayList, 5, this.audio_52EF3431_411E_AF70_41AE_35E6A1A028A3)",
   "mapColor": "#FF0000",
   "toolTip": "Nose Cone"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 15.04,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0_HS_4_0.png",
      "class": "ImageResourceLevel",
      "width": 241,
      "height": 257
     }
    ]
   },
   "pitch": 5.07,
   "yaw": 138.06
  }
 ],
 "id": "overlay_51A8D454_412A_AF30_41CA_009FCA3B3883",
 "maps": [
  {
   "hfov": 15.04,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 138.06,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0_HS_4_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 17
     }
    ]
   },
   "pitch": 5.07
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showWindow(this.window_502ADFE8_4129_D910_41BD_7E0F6BE73760, null, false); var src = this.playGlobalAudioWhilePlay(this.mainPlayList, 5, this.audio_52F22322_411A_A910_41BD_A904B89D5427)",
   "mapColor": "#FF0000",
   "toolTip": "End Wall"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 14.42,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0_HS_5_0.png",
      "class": "ImageResourceLevel",
      "width": 236,
      "height": 239
     }
    ]
   },
   "pitch": -12.96,
   "yaw": 106.25
  }
 ],
 "id": "overlay_5146695F_4129_5930_41C6_50EF8FC2D025",
 "maps": [
  {
   "hfov": 14.42,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 106.25,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB_0_HS_5_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -12.96
  }
 ]
},
{
 "class": "VideoPlayer",
 "buttonRestart": "this.IconButton_28F1F815_3EC9_4D25_41C1_2261F9203189",
 "buttonPause": "this.IconButton_28F1A815_3EC9_4D25_41A8_4FEB479A2BB2",
 "viewerArea": "this.viewer_uid55205D76_4119_59F0_41CA_47E70BEACE82",
 "id": "viewer_uid55205D76_4119_59F0_41CA_47E70BEACE82VideoPlayer",
 "displayPlaybackBar": true
},
{
 "rotate": false,
 "class": "TripodCapPanoramaOverlay",
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_tcap0.png",
    "class": "ImageResourceLevel",
    "width": 1000,
    "height": 1000
   }
  ]
 },
 "hfov": 45,
 "id": "panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3, this.camera_55533DB0_4119_5970_41BC_BC3AB2B7C1ED); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "toolTip": "Click Hear To Navigate"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 8.6,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_0_HS_5_0.png",
      "class": "ImageResourceLevel",
      "width": 143,
      "height": 152
     }
    ]
   },
   "pitch": -16.44,
   "yaw": 0.88
  }
 ],
 "id": "overlay_2FD5C2D7_3E7A_DD26_41C8_A3B685FF60AD",
 "maps": [
  {
   "hfov": 8.6,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 0.88,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_0_HS_5_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 17
     }
    ]
   },
   "pitch": -16.44
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F, this.camera_55487D9F_4119_5930_41C5_7B45359AE106); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "toolTip": "Click Hear To Navigate"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 8.52,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_0_HS_6_0.png",
      "class": "ImageResourceLevel",
      "width": 143,
      "height": 152
     }
    ]
   },
   "pitch": -18.19,
   "yaw": -179.79
  }
 ],
 "id": "overlay_2FCE3EED_3E7B_C2E5_41CB_0FA4D221546F",
 "maps": [
  {
   "hfov": 8.52,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -179.79,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_0_HS_6_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 17
     }
    ]
   },
   "pitch": -18.19
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showWindow(this.window_4D156A87_40EB_FB10_41CA_7D9147CC78CD, null, true); this.playList_55209D75_4119_59F0_41C7_ED335BC5BAEA.set('selectedIndex', 0); ; this.viewer_uid55205D76_4119_59F0_41CA_47E70BEACE82VideoPlayer.play(); ; var src = this.playGlobalAudioWhilePlay(this.mainPlayList, 1, this.audio_525F2300_4116_A910_419F_74CC26318838)",
   "mapColor": "#FF0000",
   "toolTip": "Side Wall Assembly"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.52,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_0_HS_7_0.png",
      "class": "ImageResourceLevel",
      "width": 168,
      "height": 175
     }
    ]
   },
   "pitch": -1.4,
   "yaw": 139.79
  }
 ],
 "id": "overlay_24A894DA_3E59_452E_41A0_F19BD7EADA0B",
 "maps": [
  {
   "hfov": 10.52,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 139.79,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9_0_HS_7_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -1.4
  }
 ]
},
{
 "class": "VideoPlayer",
 "buttonRestart": "this.IconButton_28F1F815_3EC9_4D25_41C1_2261F9203189",
 "buttonPause": "this.IconButton_28F1A815_3EC9_4D25_41A8_4FEB479A2BB2",
 "viewerArea": "this.viewer_uid55230D77_4119_59F0_41A6_AA611E2454BB",
 "id": "viewer_uid55230D77_4119_59F0_41A6_AA611E2454BBVideoPlayer",
 "displayPlaybackBar": true
},
{
 "class": "VideoPlayer",
 "buttonRestart": "this.IconButton_28F1F815_3EC9_4D25_41C1_2261F9203189",
 "buttonPause": "this.IconButton_28F1A815_3EC9_4D25_41A8_4FEB479A2BB2",
 "viewerArea": "this.viewer_uid55246D79_4119_59F0_41CA_AFFA551DC046",
 "id": "viewer_uid55246D79_4119_59F0_41CA_AFFA551DC046VideoPlayer",
 "displayPlaybackBar": true
},
{
 "progressBarBorderColor": "#000000",
 "progressBackgroundColorDirection": "vertical",
 "id": "viewer_uid5528DD7C_4119_59F0_41CF_26098DE92B7E",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarBottom": 0,
 "toolTipShadowSpread": 0,
 "playbackBarHeadOpacity": 1,
 "progressBorderColor": "#000000",
 "toolTipBorderColor": "#767676",
 "width": "100%",
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "paddingLeft": 0,
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipFontSize": "1.11vmin",
 "toolTipOpacity": 1,
 "toolTipShadowBlurRadius": 3,
 "minHeight": 50,
 "toolTipTextShadowColor": "#000000",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "playbackBarRight": 0,
 "playbackBarHeight": 10,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowBlurRadius": 3,
 "toolTipPaddingBottom": 4,
 "minWidth": 100,
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "toolTipFontWeight": "normal",
 "height": "50%",
 "progressBarBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarBorderRadius": 0,
 "playbackBarHeadBorderRadius": 0,
 "transitionMode": "blending",
 "class": "ViewerArea",
 "playbackBarHeadBorderColor": "#000000",
 "toolTipShadowOpacity": 1,
 "progressLeft": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "shadow": false,
 "playbackBarBorderSize": 0,
 "toolTipShadowHorizontalLength": 0,
 "propagateClick": false,
 "playbackBarBackgroundOpacity": 1,
 "toolTipFontStyle": "normal",
 "toolTipFontFamily": "Arial",
 "toolTipShadowVerticalLength": 0,
 "vrPointerSelectionColor": "#FF6600",
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "borderSize": 0,
 "paddingRight": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadow": true,
 "progressBottom": 2,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "progressHeight": 10,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "displayTooltipInTouchScreens": true,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "toolTipBorderSize": 1,
 "toolTipPaddingTop": 4,
 "toolTipPaddingLeft": 6,
 "progressBorderRadius": 0,
 "paddingTop": 0,
 "toolTipDisplayTime": 600,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "paddingBottom": 0,
 "toolTipPaddingRight": 6,
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "transitionDuration": 500,
 "data": {
  "name": "ViewerArea29540"
 }
},
{
 "propagateClick": false,
 "id": "htmlText_506AFCE5_4129_5F10_41A8_3C3F7485FEB0",
 "scrollBarColor": "#000000",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingRight": 10,
 "paddingLeft": 10,
 "scrollBarVisible": "rollOver",
 "minHeight": 0,
 "width": "100%",
 "scrollBarMargin": 2,
 "minWidth": 0,
 "height": "50%",
 "paddingTop": 10,
 "paddingBottom": 10,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "class": "HTMLText",
 "data": {
  "name": "HTMLText13046"
 },
 "scrollBarWidth": 10,
 "html": ""
},
{
 "progressBarBorderColor": "#000000",
 "progressBackgroundColorDirection": "vertical",
 "id": "viewer_uid55230D77_4119_59F0_41A6_AA611E2454BB",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarBottom": 0,
 "toolTipShadowSpread": 0,
 "playbackBarHeadOpacity": 1,
 "progressBorderColor": "#000000",
 "toolTipBorderColor": "#767676",
 "width": "100%",
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "paddingLeft": 0,
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipFontSize": "1.11vmin",
 "toolTipOpacity": 1,
 "toolTipShadowBlurRadius": 3,
 "minHeight": 50,
 "toolTipTextShadowColor": "#000000",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "playbackBarRight": 0,
 "playbackBarHeight": 10,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowBlurRadius": 3,
 "toolTipPaddingBottom": 4,
 "minWidth": 100,
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "toolTipFontWeight": "normal",
 "height": "50%",
 "progressBarBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarBorderRadius": 0,
 "playbackBarHeadBorderRadius": 0,
 "transitionMode": "blending",
 "class": "ViewerArea",
 "playbackBarHeadBorderColor": "#000000",
 "toolTipShadowOpacity": 1,
 "progressLeft": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "shadow": false,
 "playbackBarBorderSize": 0,
 "toolTipShadowHorizontalLength": 0,
 "propagateClick": false,
 "playbackBarBackgroundOpacity": 1,
 "toolTipFontStyle": "normal",
 "toolTipFontFamily": "Arial",
 "toolTipShadowVerticalLength": 0,
 "vrPointerSelectionColor": "#FF6600",
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "borderSize": 0,
 "paddingRight": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadow": true,
 "progressBottom": 2,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "progressHeight": 10,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "displayTooltipInTouchScreens": true,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "toolTipBorderSize": 1,
 "toolTipPaddingTop": 4,
 "toolTipPaddingLeft": 6,
 "progressBorderRadius": 0,
 "paddingTop": 0,
 "toolTipDisplayTime": 600,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "paddingBottom": 0,
 "toolTipPaddingRight": 6,
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "transitionDuration": 500,
 "data": {
  "name": "ViewerArea29535"
 }
},
{
 "propagateClick": false,
 "id": "htmlText_51886F6B_4137_7910_41C6_832E86AB3B84",
 "scrollBarColor": "#000000",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingRight": 10,
 "paddingLeft": 10,
 "scrollBarVisible": "rollOver",
 "minHeight": 0,
 "width": "100%",
 "scrollBarMargin": 2,
 "minWidth": 0,
 "height": "50%",
 "paddingTop": 10,
 "paddingBottom": 10,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "class": "HTMLText",
 "data": {
  "name": "HTMLText5685"
 },
 "scrollBarWidth": 10,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\">The Assembled Side Wall is Carefully Moved With Gaint Crane and Packed For Despatch.</SPAN></DIV></div>"
},
{
 "class": "VideoPlayer",
 "buttonRestart": "this.IconButton_28F1F815_3EC9_4D25_41C1_2261F9203189",
 "buttonPause": "this.IconButton_28F1A815_3EC9_4D25_41A8_4FEB479A2BB2",
 "viewerArea": "this.viewer_uid55259D78_4119_59F0_41C7_04C3A608C132",
 "id": "viewer_uid55259D78_4119_59F0_41C7_04C3A608C132VideoPlayer",
 "displayPlaybackBar": true
},
{
 "transparencyActive": false,
 "propagateClick": false,
 "id": "IconButton_28F1F815_3EC9_4D25_41C1_2261F9203189",
 "width": 40,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "minHeight": 0,
 "verticalAlign": "middle",
 "iconURL": "skin/IconButton_28F1F815_3EC9_4D25_41C1_2261F9203189.png",
 "minWidth": 0,
 "mode": "push",
 "height": 40,
 "rollOverIconURL": "skin/IconButton_28F1F815_3EC9_4D25_41C1_2261F9203189_rollover.png",
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "pressedIconURL": "skin/IconButton_28F1F815_3EC9_4D25_41C1_2261F9203189_pressed.png",
 "class": "IconButton",
 "data": {
  "name": "Button27663"
 },
 "shadow": false,
 "cursor": "hand"
},
{
 "transparencyActive": false,
 "propagateClick": false,
 "id": "IconButton_28F18815_3EC9_4D25_41BA_3F1D28B348E9",
 "width": 32,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "minHeight": 0,
 "verticalAlign": "middle",
 "iconURL": "skin/IconButton_28F18815_3EC9_4D25_41BA_3F1D28B348E9.png",
 "minWidth": 0,
 "mode": "push",
 "height": 32,
 "rollOverIconURL": "skin/IconButton_28F18815_3EC9_4D25_41BA_3F1D28B348E9_rollover.png",
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "pressedIconURL": "skin/IconButton_28F18815_3EC9_4D25_41BA_3F1D28B348E9_pressed.png",
 "class": "IconButton",
 "data": {
  "name": "Button27670"
 },
 "shadow": false,
 "cursor": "hand"
},
{
 "transparencyActive": false,
 "propagateClick": false,
 "id": "IconButton_28F21814_3EC9_4D3B_41B2_E02332748685",
 "width": 32,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "minHeight": 0,
 "verticalAlign": "middle",
 "iconURL": "skin/IconButton_28F21814_3EC9_4D3B_41B2_E02332748685.png",
 "minWidth": 0,
 "mode": "push",
 "height": 32,
 "rollOverIconURL": "skin/IconButton_28F21814_3EC9_4D3B_41B2_E02332748685_rollover.png",
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "pressedIconURL": "skin/IconButton_28F21814_3EC9_4D3B_41B2_E02332748685_pressed.png",
 "class": "IconButton",
 "data": {
  "name": "Button27662"
 },
 "shadow": false,
 "cursor": "hand"
},
{
 "transparencyActive": false,
 "propagateClick": false,
 "id": "IconButton_28F17815_3EC9_4D25_41B4_CB4FD2FEA961",
 "width": 40,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "minHeight": 0,
 "verticalAlign": "middle",
 "iconURL": "skin/IconButton_28F17815_3EC9_4D25_41B4_CB4FD2FEA961.png",
 "minWidth": 0,
 "mode": "push",
 "height": 40,
 "rollOverIconURL": "skin/IconButton_28F17815_3EC9_4D25_41B4_CB4FD2FEA961_rollover.png",
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "pressedIconURL": "skin/IconButton_28F17815_3EC9_4D25_41B4_CB4FD2FEA961_pressed.png",
 "class": "IconButton",
 "data": {
  "name": "Button27671"
 },
 "shadow": false,
 "cursor": "hand"
},
{
 "transparencyActive": false,
 "propagateClick": false,
 "id": "IconButton_28F1E815_3EC9_4D25_41CE_C6D2CA3828D5",
 "width": 40,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "minHeight": 0,
 "verticalAlign": "middle",
 "iconURL": "skin/IconButton_28F1E815_3EC9_4D25_41CE_C6D2CA3828D5.png",
 "minWidth": 0,
 "mode": "push",
 "height": 40,
 "rollOverIconURL": "skin/IconButton_28F1E815_3EC9_4D25_41CE_C6D2CA3828D5_rollover.png",
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "pressedIconURL": "skin/IconButton_28F1E815_3EC9_4D25_41CE_C6D2CA3828D5_pressed.png",
 "class": "IconButton",
 "data": {
  "name": "Button27664"
 },
 "shadow": false,
 "cursor": "hand"
},
{
 "transparencyActive": false,
 "propagateClick": false,
 "id": "IconButton_28F14815_3EC9_4D25_41CE_B6CCF7A72026",
 "width": 32,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "minHeight": 0,
 "verticalAlign": "middle",
 "iconURL": "skin/IconButton_28F14815_3EC9_4D25_41CE_B6CCF7A72026.png",
 "minWidth": 0,
 "mode": "push",
 "height": 32,
 "rollOverIconURL": "skin/IconButton_28F14815_3EC9_4D25_41CE_B6CCF7A72026_rollover.png",
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "pressedIconURL": "skin/IconButton_28F14815_3EC9_4D25_41CE_B6CCF7A72026_pressed.png",
 "class": "IconButton",
 "data": {
  "name": "Button27673"
 },
 "shadow": false,
 "cursor": "hand"
},
{
 "transparencyActive": false,
 "propagateClick": false,
 "id": "IconButton_28F1B815_3EC9_4D25_41A1_348BB1FD9351",
 "width": 32,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "minHeight": 0,
 "verticalAlign": "middle",
 "iconURL": "skin/IconButton_28F1B815_3EC9_4D25_41A1_348BB1FD9351.png",
 "minWidth": 0,
 "mode": "push",
 "height": 32,
 "rollOverIconURL": "skin/IconButton_28F1B815_3EC9_4D25_41A1_348BB1FD9351_rollover.png",
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "pressedIconURL": "skin/IconButton_28F1B815_3EC9_4D25_41A1_348BB1FD9351_pressed.png",
 "class": "IconButton",
 "data": {
  "name": "Button27667"
 },
 "shadow": false,
 "cursor": "hand"
},
{
 "transparencyActive": false,
 "propagateClick": false,
 "id": "IconButton_28F19815_3EC9_4D25_41C7_52A989E1F255",
 "width": 32,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "minHeight": 0,
 "verticalAlign": "middle",
 "iconURL": "skin/IconButton_28F19815_3EC9_4D25_41C7_52A989E1F255.png",
 "minWidth": 0,
 "mode": "push",
 "height": 32,
 "rollOverIconURL": "skin/IconButton_28F19815_3EC9_4D25_41C7_52A989E1F255_rollover.png",
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "pressedIconURL": "skin/IconButton_28F19815_3EC9_4D25_41C7_52A989E1F255_pressed.png",
 "class": "IconButton",
 "data": {
  "name": "Button27669"
 },
 "shadow": false,
 "cursor": "hand"
},
{
 "transparencyActive": false,
 "propagateClick": false,
 "id": "IconButton_28F1A815_3EC9_4D25_41A8_4FEB479A2BB2",
 "width": 40,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "minHeight": 0,
 "verticalAlign": "middle",
 "iconURL": "skin/IconButton_28F1A815_3EC9_4D25_41A8_4FEB479A2BB2.png",
 "minWidth": 0,
 "mode": "toggle",
 "height": 40,
 "rollOverIconURL": "skin/IconButton_28F1A815_3EC9_4D25_41A8_4FEB479A2BB2_rollover.png",
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "pressedIconURL": "skin/IconButton_28F1A815_3EC9_4D25_41A8_4FEB479A2BB2_pressed.png",
 "class": "IconButton",
 "data": {
  "name": "Button27668"
 },
 "shadow": false,
 "cursor": "hand"
},
{
 "transparencyActive": false,
 "propagateClick": false,
 "id": "IconButton_28F1D815_3EC9_4D25_41A7_0311A21BA535",
 "width": 32,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "minHeight": 0,
 "verticalAlign": "middle",
 "iconURL": "skin/IconButton_28F1D815_3EC9_4D25_41A7_0311A21BA535.png",
 "minWidth": 0,
 "mode": "push",
 "height": 32,
 "rollOverIconURL": "skin/IconButton_28F1D815_3EC9_4D25_41A7_0311A21BA535_rollover.png",
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "pressedIconURL": "skin/IconButton_28F1D815_3EC9_4D25_41A7_0311A21BA535_pressed.png",
 "class": "IconButton",
 "data": {
  "name": "Button27665"
 },
 "shadow": false,
 "cursor": "hand"
},
{
 "progressBarBorderColor": "#000000",
 "progressBackgroundColorDirection": "vertical",
 "id": "viewer_uid55259D78_4119_59F0_41C7_04C3A608C132",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarBottom": 0,
 "toolTipShadowSpread": 0,
 "playbackBarHeadOpacity": 1,
 "progressBorderColor": "#000000",
 "toolTipBorderColor": "#767676",
 "width": "100%",
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "paddingLeft": 0,
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipFontSize": "1.11vmin",
 "toolTipOpacity": 1,
 "toolTipShadowBlurRadius": 3,
 "minHeight": 50,
 "toolTipTextShadowColor": "#000000",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "playbackBarRight": 0,
 "playbackBarHeight": 10,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowBlurRadius": 3,
 "toolTipPaddingBottom": 4,
 "minWidth": 100,
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "toolTipFontWeight": "normal",
 "height": "50%",
 "progressBarBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarBorderRadius": 0,
 "playbackBarHeadBorderRadius": 0,
 "transitionMode": "blending",
 "class": "ViewerArea",
 "playbackBarHeadBorderColor": "#000000",
 "toolTipShadowOpacity": 1,
 "progressLeft": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "shadow": false,
 "playbackBarBorderSize": 0,
 "toolTipShadowHorizontalLength": 0,
 "propagateClick": false,
 "playbackBarBackgroundOpacity": 1,
 "toolTipFontStyle": "normal",
 "toolTipFontFamily": "Arial",
 "toolTipShadowVerticalLength": 0,
 "vrPointerSelectionColor": "#FF6600",
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "borderSize": 0,
 "paddingRight": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadow": true,
 "progressBottom": 2,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "progressHeight": 10,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "displayTooltipInTouchScreens": true,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "toolTipBorderSize": 1,
 "toolTipPaddingTop": 4,
 "toolTipPaddingLeft": 6,
 "progressBorderRadius": 0,
 "paddingTop": 0,
 "toolTipDisplayTime": 600,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "paddingBottom": 0,
 "toolTipPaddingRight": 6,
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "transitionDuration": 500,
 "data": {
  "name": "ViewerArea29536"
 }
},
{
 "propagateClick": false,
 "id": "htmlText_53083D69_4179_7910_4192_ED9990ED76AB",
 "scrollBarColor": "#000000",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingRight": 10,
 "paddingLeft": 10,
 "scrollBarVisible": "rollOver",
 "minHeight": 0,
 "width": "100%",
 "scrollBarMargin": 2,
 "minWidth": 0,
 "height": "50%",
 "paddingTop": 10,
 "paddingBottom": 10,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "class": "HTMLText",
 "data": {
  "name": "HTMLText15664"
 },
 "scrollBarWidth": 10,
 "html": "<div style=\"text-align:left; color:#000; \"><p STYLE=\"margin:0; line-height:12px;\"><BR STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"/></p></div>"
},
{
 "class": "VideoPlayer",
 "buttonRestart": "this.IconButton_28F1F815_3EC9_4D25_41C1_2261F9203189",
 "buttonPause": "this.IconButton_28F1A815_3EC9_4D25_41A8_4FEB479A2BB2",
 "viewerArea": "this.viewer_uid5528DD7C_4119_59F0_41CF_26098DE92B7E",
 "id": "viewer_uid5528DD7C_4119_59F0_41CF_26098DE92B7EVideoPlayer",
 "displayPlaybackBar": true
},
{
 "rotate": false,
 "class": "TripodCapPanoramaOverlay",
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_tcap0.png",
    "class": "ImageResourceLevel",
    "width": 1000,
    "height": 1000
   }
  ]
 },
 "hfov": 45,
 "id": "panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_32CCFB43_3E49_C31D_418B_49E52041CDCB, this.camera_54BCEE4E_4119_5B11_4197_88E05710919F); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "toolTip": "Click Hear To Navigate"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 6.3,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_0_HS_0_0.png",
      "class": "ImageResourceLevel",
      "width": 101,
      "height": 116
     }
    ]
   },
   "pitch": -7.1,
   "yaw": 3.8
  }
 ],
 "id": "overlay_2A1E7FC1_3E3A_C31D_41C1_4899BFADA107",
 "maps": [
  {
   "hfov": 6.3,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 3.8,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 18
     }
    ]
   },
   "pitch": -7.1
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_32D513E4_3E49_431B_41C0_F94602EC1E99, this.camera_54AFDE3B_4119_5B77_41A2_FC05B0BC201E); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "toolTip": "Click Hear To Navigate"
  }
 ],
 "data": {
  "label": "Arrow Transparent Right-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 9.63,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_0_HS_1_0.png",
      "class": "ImageResourceLevel",
      "width": 160,
      "height": 157
     }
    ]
   },
   "pitch": -16.68,
   "yaw": -109.41
  }
 ],
 "id": "overlay_2D5BFD57_3E3F_C726_41B9_E64C70ED3DFE",
 "maps": [
  {
   "hfov": 9.63,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -109.41,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -16.68
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showWindow(this.window_519246F6_413B_A8F0_41CB_C88E33C1578B, null, true); this.playList_55245D79_4119_59F0_4176_40F2E531D4C6.set('selectedIndex', 0); ; this.viewer_uid55246D79_4119_59F0_41CA_AFFA551DC046VideoPlayer.play(); ; var src = this.playGlobalAudioWhilePlay(this.mainPlayList, 4, this.audio_55C292A7_412A_EB10_41C3_97B64D1A545F)",
   "mapColor": "#FF0000",
   "toolTip": "Roof Assembely"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 17.89,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_0_HS_2_0.png",
      "class": "ImageResourceLevel",
      "width": 288,
      "height": 288
     }
    ]
   },
   "pitch": 7.89,
   "yaw": 48.1
  }
 ],
 "id": "overlay_51A04D0E_413A_B910_41BE_4D1CD2EEA76C",
 "maps": [
  {
   "hfov": 17.89,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 48.1,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D263E4_3E49_C31A_41A5_1B1CBAF6DFDC_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 7.89
  }
 ]
},
{
 "rotate": false,
 "class": "TripodCapPanoramaOverlay",
 "angle": 0,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/panorama_338FF6C2_3E49_451E_41B0_5BA3916B1BC3_tcap0.png",
    "class": "ImageResourceLevel",
    "width": 1000,
    "height": 1000
   }
  ]
 },
 "hfov": 45,
 "id": "panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_32D7CBFE_3E49_42E6_41C2_602523A067C9, this.camera_54A29E2A_4119_5B11_41C1_65DFE7B11CAF); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "toolTip": "Click Hear To Navigate"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 7.17,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_0_HS_2_0.png",
      "class": "ImageResourceLevel",
      "width": 118,
      "height": 120
     }
    ]
   },
   "pitch": -15.01,
   "yaw": 12.83
  }
 ],
 "id": "overlay_2CAEFEF3_3E47_42FD_41B3_CFBD452C430A",
 "maps": [
  {
   "hfov": 7.17,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 12.83,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -15.01
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_32D513E4_3E49_431B_41C0_F94602EC1E99, this.camera_54976E18_4119_5B31_41BC_BB225E865849); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "toolTip": "Click Hear To Navigate"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 6.02,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_0_HS_3_0.png",
      "class": "ImageResourceLevel",
      "width": 96,
      "height": 118
     }
    ]
   },
   "pitch": -6,
   "yaw": -173.86
  }
 ],
 "id": "overlay_2FF10A18_3E49_CD2A_4163_FA8471C4F794",
 "maps": [
  {
   "hfov": 6.02,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -173.86,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_0_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 19
     }
    ]
   },
   "pitch": -6
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showWindow(this.window_5188DF6B_4137_7910_41C9_B0B5137C905C, null, true); this.playList_55237D77_4119_59F0_41C4_AA4AA89FDC94.set('selectedIndex', 0); ; this.viewer_uid55230D77_4119_59F0_41A6_AA611E2454BBVideoPlayer.play(); ; var src = this.playGlobalAudioWhilePlay(this.mainPlayList, 2, this.audio_5256E541_4116_A910_418C_B7AA39A4136B)",
   "mapColor": "#FF0000",
   "toolTip": "Side Wall Packaging"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 15.75,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_0_HS_4_0.png",
      "class": "ImageResourceLevel",
      "width": 252,
      "height": 271
     }
    ]
   },
   "pitch": -4.67,
   "yaw": -147.73
  }
 ],
 "id": "overlay_4E350DDD_4129_B933_41C6_C9291A9AEC4A",
 "maps": [
  {
   "hfov": 15.75,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -147.73,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_32D53C08_3E49_452A_41B9_97F3B9B9D75F_0_HS_4_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 17
     }
    ]
   },
   "pitch": -4.67
  }
 ]
},
{
 "progressBarBorderColor": "#000000",
 "progressBackgroundColorDirection": "vertical",
 "id": "viewer_uid5526FD7A_4119_59F0_41B0_AEAAAD8CE51E",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarBottom": 0,
 "toolTipShadowSpread": 0,
 "playbackBarHeadOpacity": 1,
 "progressBorderColor": "#000000",
 "toolTipBorderColor": "#767676",
 "width": "100%",
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "paddingLeft": 0,
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipFontSize": "1.11vmin",
 "toolTipOpacity": 1,
 "toolTipShadowBlurRadius": 3,
 "minHeight": 50,
 "toolTipTextShadowColor": "#000000",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "playbackBarRight": 0,
 "playbackBarHeight": 10,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowBlurRadius": 3,
 "toolTipPaddingBottom": 4,
 "minWidth": 100,
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "toolTipFontWeight": "normal",
 "height": "50%",
 "progressBarBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarBorderRadius": 0,
 "playbackBarHeadBorderRadius": 0,
 "transitionMode": "blending",
 "class": "ViewerArea",
 "playbackBarHeadBorderColor": "#000000",
 "toolTipShadowOpacity": 1,
 "progressLeft": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "shadow": false,
 "playbackBarBorderSize": 0,
 "toolTipShadowHorizontalLength": 0,
 "propagateClick": false,
 "playbackBarBackgroundOpacity": 1,
 "toolTipFontStyle": "normal",
 "toolTipFontFamily": "Arial",
 "toolTipShadowVerticalLength": 0,
 "vrPointerSelectionColor": "#FF6600",
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "borderSize": 0,
 "paddingRight": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadow": true,
 "progressBottom": 2,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "progressHeight": 10,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "displayTooltipInTouchScreens": true,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "toolTipBorderSize": 1,
 "toolTipPaddingTop": 4,
 "toolTipPaddingLeft": 6,
 "progressBorderRadius": 0,
 "paddingTop": 0,
 "toolTipDisplayTime": 600,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "paddingBottom": 0,
 "toolTipPaddingRight": 6,
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "transitionDuration": 500,
 "data": {
  "name": "ViewerArea29538"
 }
},
{
 "propagateClick": false,
 "id": "htmlText_51DC0F03_4137_B917_41A9_CDDA20B3BDAD",
 "scrollBarColor": "#000000",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingRight": 10,
 "paddingLeft": 10,
 "scrollBarVisible": "rollOver",
 "minHeight": 0,
 "width": "100%",
 "scrollBarMargin": 2,
 "minWidth": 0,
 "height": "50%",
 "paddingTop": 10,
 "paddingBottom": 10,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "class": "HTMLText",
 "data": {
  "name": "HTMLText9486"
 },
 "scrollBarWidth": 10,
 "html": "<div style=\"text-align:left; color:#000; \"><p STYLE=\"margin:0; line-height:12px;\"><BR STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"/></p></div>"
},
{
 "propagateClick": false,
 "id": "image_uid55266D7A_4119_59F0_418D_92FE91DFA462_0",
 "width": "100%",
 "borderSize": 0,
 "paddingRight": 0,
 "url": "media/photo_50AA91D3_412F_E930_41CF_B9DDE8CF7CC1.jpg",
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "minHeight": 0,
 "verticalAlign": "middle",
 "minWidth": 0,
 "height": "50%",
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "scaleMode": "fit_inside",
 "borderRadius": 0,
 "shadow": false,
 "class": "Image",
 "data": {
  "name": "Image29539"
 }
},
{
 "propagateClick": false,
 "id": "htmlText_50289FE9_4129_D910_41BC_15A2B39DCAC9",
 "scrollBarColor": "#000000",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingRight": 10,
 "paddingLeft": 10,
 "scrollBarVisible": "rollOver",
 "minHeight": 0,
 "width": "100%",
 "scrollBarMargin": 2,
 "minWidth": 0,
 "height": "50%",
 "paddingTop": 10,
 "paddingBottom": 10,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "class": "HTMLText",
 "data": {
  "name": "HTMLText11661"
 },
 "scrollBarWidth": 10,
 "html": "<div style=\"text-align:left; color:#000; \"><p STYLE=\"margin:0; line-height:12px;\"><BR STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"/></p></div>"
},
{
 "shadow": false,
 "propagateClick": false,
 "children": [
  "this.IconButton_28F1B815_3EC9_4D25_41A1_348BB1FD9351",
  "this.IconButton_28F1A815_3EC9_4D25_41A8_4FEB479A2BB2",
  "this.IconButton_28F19815_3EC9_4D25_41C7_52A989E1F255"
 ],
 "id": "Container_28F1C815_3EC9_4D25_41CD_570B80F29BD2",
 "width": 40,
 "scrollBarColor": "#000000",
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "horizontalAlign": "center",
 "minHeight": 20,
 "scrollBarOpacity": 0.5,
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "minWidth": 20,
 "verticalAlign": "middle",
 "height": "100%",
 "gap": 4,
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "class": "Container",
 "data": {
  "name": "Container27666"
 },
 "overflow": "hidden",
 "scrollBarWidth": 10,
 "layout": "vertical"
}],
 "width": "100%"
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
