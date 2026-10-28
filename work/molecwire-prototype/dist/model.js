(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.MWModel = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  var sourceCatalog = {
    'src-a-v1':{id:'src-a-v1',name:'Kurgusal şirket duyurusu',type:'Birincil beyan',summary:'Planın duyurulduğunu destekler; uygulandığını doğrulamaz.',detail:'İlk beyan · kapasite planı; üretim sonucu yok.'},
    'src-a-v2':{id:'src-a-v2',name:'Kurgusal şirket duyurusu · güncelleme',type:'Birincil beyan',summary:'Plan tekrarlandı; gerçekleşen üretimi doğrulamaz.',detail:'Sonraki açıklama · plan tekrarı; bağımsız sonuç yok.'}
  };
  var stories = [
    {id:'capacity',category:'Üretim',title:'Örnek Üretici A, kapasite planını paylaştı',summary:'Ara ürün hattı için yeni kapasite planı duyuruldu. Takvim ve gerçekleşen üretim miktarı henüz açıklanmadı.',sourceType:'Şirket açıklaması',independence:'Bağımsız doğrulama yok',date:'28 Ekim 2026',publishedVersion:2,body:'Örnek Üretici A, ara ürün hattında kapasite artışı planladığını duyurdu. Şirket açıklamasında yatırım takvimi, finansman ve izin durumu paylaşılmadı. Üretimin başladığını veya arttığını gösteren veri henüz yok.',context:'Ara ürünler, birçok ilaç ve kimyasal ürünün tedarik zincirinde kritik bir yer tutuyor. Bu plan, orta vadede ilgili ürün gruplarında tedarik seçeneklerinin artma potansiyeline işaret edebilir. Ancak tek başına bu açıklama, gerçekleşen üretim miktarında bir değişim olduğu anlamına gelmiyor.',unknowns:['Yatırım takvimi','Finansman ve izinler','Gerçekleşen üretim etkisi'],sources:[{id:'src-a-v1',name:'Kurgusal şirket duyurusu',type:'Birincil beyan',summary:'Planın duyurulduğunu destekler; uygulandığını doğrulamaz.'}],history:[{version:2,note:'İfade ve kapsam netleştirildi.'},{version:1,note:'İlk yayın.'}]},
    {id:'guidance',category:'Regülasyon',title:'Taslak kılavuz görüşe açıldı',summary:'Örnek Kurum B, taslak metin için görüş topluyor. Metin henüz nihai bir düzenleme değil.',sourceType:'Kurum duyurusu',independence:'Taslak metin mevcut',date:'28 Ekim 2026',publishedVersion:1,body:'Örnek Kurum B, kurgusal bir teknik kılavuz taslağını görüşe açtığını duyurdu. Görüş dönemi sonunda metin değişebilir.',context:'Taslak aşamasında paydaşların yorumları nihai metni etkileyebilir. Kuruluşlar mevcut yükümlülükleri taslak önerilerle karıştırmamalıdır.',unknowns:['Nihai metin','Yürürlük tarihi'],sources:[{id:'src-b-v1',name:'Kurgusal kurum duyurusu',type:'Birincil belge',summary:'Görüş çağrısını destekler; nihai karar değildir.'}],history:[{version:1,note:'İlk yayın.'}]},
    {id:'pilot',category:'Araştırma',title:'Hammadde ölçümü için pilot yöntem',summary:'Örnek Laboratuvar C, pilot çalışmasını tanıttı. Bağımsız doğrulama sonuçları henüz paylaşılmadı.',sourceType:'Laboratuvar özeti',independence:'Bağımsız doğrulama yok',date:'27 Ekim 2026',publishedVersion:1,body:'Örnek Laboratuvar C, hammadde ölçümü için denediği bir pilot yöntemi özetledi. Sonuçlar küçük ölçekli ön çalışmayla sınırlı.',context:'Yöntem, daha kapsamlı değerlendirme için bir başlangıç olabilir. Geniş uygulama için bağımsız karşılaştırmalar gerekir.',unknowns:['Bağımsız tekrar','Geniş örneklem performansı'],sources:[{id:'src-c-v1',name:'Kurgusal laboratuvar özeti',type:'Birincil araştırma özeti',summary:'Pilot çalışmayı tanımlar; yaygın kullanıma uygunluğu doğrulamaz.'}],history:[{version:1,note:'İlk yayın.'}]},
    {id:'supply',category:'Kimya',title:'Yeni tedarik rotası için ön çalışma açıklandı',summary:'Örnek Kimya D, alternatif taşıma rotasını değerlendiriyor. Ticari kullanım kararı verilmedi.',sourceType:'Şirket açıklaması',independence:'Bağımsız doğrulama yok',date:'26 Ekim 2026',publishedVersion:1,body:'Örnek Kimya D, alternatif bir tedarik rotası için ön çalışma yürüttüğünü açıkladı.',context:'Rota çeşitliliği olası kesintilere hazırlığı destekleyebilir.',unknowns:['Ticari kullanım kararı','Maliyet ve kapasite'],sources:[{id:'src-d-v1',name:'Kurgusal şirket duyurusu',type:'Birincil beyan',summary:'Ön çalışma beyanını destekler.'}],history:[{version:1,note:'İlk yayın.'}]},
    {id:'quality',category:'İlaç',title:'Yardımcı madde kalite rehberi güncellendi',summary:'Kurgusal meslek grubu, gönüllü uygulama notlarını yayımladı. Notlar bağlayıcı düzenleme değil.',sourceType:'Meslek grubu notu',independence:'Bağımsız inceleme bilinmiyor',date:'25 Ekim 2026',publishedVersion:1,body:'Kurgusal meslek grubu, yardımcı maddelere ilişkin gönüllü kalite notları yayımladı.',context:'Notlar kurum içi kalite süreçleri için tartışma zemini sunabilir.',unknowns:['Uygulama kapsamı'],sources:[{id:'src-e-v1',name:'Kurgusal grup notu',type:'Birincil belge',summary:'Notların yayımlandığını destekler.'}],history:[{version:1,note:'İlk yayın.'}]},
    {id:'packaging',category:'İlaç',title:'Ambalaj testinde erken aşama sonuçlar paylaşıldı',summary:'Örnek Araştırma E, laboratuvar koşullarındaki ilk gözlemlerini sundu. Saha performansı bilinmiyor.',sourceType:'Araştırma özeti',independence:'Bağımsız doğrulama yok',date:'24 Ekim 2026',publishedVersion:1,body:'Örnek Araştırma E, ambalaj testinin laboratuvar sonuçlarını özetledi.',context:'Erken sonuçlar gerçek kullanım koşullarını temsil etmeyebilir.',unknowns:['Saha performansı','Tekrar çalışmaları'],sources:[{id:'src-f-v1',name:'Kurgusal araştırma özeti',type:'Birincil araştırma özeti',summary:'Erken gözlemleri tanımlar.'}],history:[{version:1,note:'İlk yayın.'}]},
    {id:'solvent',category:'Kimya',title:'Çözücü geri kazanımı için deneme başlatıldı',summary:'Örnek Tesis F, pilot ölçekte bir süreç deniyor. Verim ve tasarruf verileri paylaşılmadı.',sourceType:'Tesis duyurusu',independence:'Bağımsız doğrulama yok',date:'23 Ekim 2026',publishedVersion:1,body:'Örnek Tesis F, çözücü geri kazanımı için pilot süreç başlattığını duyurdu.',context:'Pilot veriler daha büyük ölçek kararlarına temel oluşturabilir.',unknowns:['Verim','Ekonomik etki'],sources:[{id:'src-g-v1',name:'Kurgusal tesis duyurusu',type:'Birincil beyan',summary:'Deneme beyanını destekler.'}],history:[{version:1,note:'İlk yayın.'}]},
    {id:'analysis',category:'Araştırma',title:'Saflık karşılaştırması için çalışma önerildi',summary:'Örnek Ekip G, karşılaştırmalı ölçüm tasarımı paylaştı. Henüz deney sonucu yok.',sourceType:'Çalışma önerisi',independence:'Sonuç bulunmuyor',date:'22 Ekim 2026',publishedVersion:1,body:'Örnek Ekip G, saflık yöntemlerini karşılaştıracak bir çalışma tasarımı sundu.',context:'Tasarım yayımlanması deneysel bulgu olduğu anlamına gelmez.',unknowns:['Deney sonuçları','Uygulanabilirlik'],sources:[{id:'src-h-v1',name:'Kurgusal çalışma önerisi',type:'Birincil belge',summary:'Önerilen tasarımı tanımlar.'}],history:[{version:1,note:'İlk yayın.'}]}
  ];
  function initial() {
    var published = {};
    stories.forEach(function(s){ published[s.id]=clone(s); });
    return {published:published, editor:{id:'capacity',locale:'Türkçe',draftVersion:3,approved:null,approvalHistory:[],reviewed:false,dirty:false,publishCount:0,draft:{title:'Örnek Üretici A, kapasite planını paylaştı',summary:'Şirket kapasite artışı planladığını açıkladı. Gerçekleşen üretime ilişkin veri yok.',body:'Örnek Üretici A, önümüzdeki dönemde ara ürün kapasitesini artırmayı planladığını duyurdu. Şirketin açıklamasında planlanan kapasite artışına ilişkin takvim veya gerçekleşen üretim miktarına dair henüz veri paylaşılmadı.',context:published.capacity.context,unknowns:'Yatırım takvimi; Finansman ve izinler; Gerçekleşen üretim etkisi',correctionNote:'',claimWording:'Şirket kapasite artırmayı planlıyor',evidenceId:'src-a-v1',evidenceRelation:'Şirket beyanına dayalı',credibility:'Birincil şirket beyanı; planın varlığına kaynak.',corroboration:'Bağımsız destek yok.',completeness:'Takvim ve üretim verisi eksik.',readiness:'Atıfla yayımlanabilir; gerçekleşmiş üretim iddiası kurulamaz.',assessmentVersion:1}}};
  }
  function valid(d) { return ['title','summary','body','claimWording','evidenceId','evidenceRelation','credibility','corroboration','completeness','readiness'].every(function(k){return typeof d[k]==='string' && d[k].trim().length>0;}) && ['src-a-v1','src-a-v2'].indexOf(d.evidenceId)>=0; }
  function saveDraft(state, patch) {
    var next=clone(state), before=JSON.stringify(next.editor.draft);
    Object.keys(patch||{}).forEach(function(k){ if(k!=='assessmentVersion' && Object.prototype.hasOwnProperty.call(next.editor.draft,k)) next.editor.draft[k]=String(patch[k]); });
    var assessmentFields=['claimWording','evidenceId','evidenceRelation','credibility','corroboration','completeness','readiness'];
    if(assessmentFields.some(function(k){return next.editor.draft[k]!==state.editor.draft[k];})) next.editor.draft.assessmentVersion+=1;
    if(JSON.stringify(next.editor.draft)===before) { next.editor.dirty=false; return {ok:true,noop:true,state:next}; }
    next.editor.draftVersion+=1; next.editor.approved=null; next.editor.reviewed=false; next.editor.dirty=false;
    return {ok:true,state:next};
  }
  function setReviewed(state, value) { var next=clone(state); next.editor.reviewed=!!value; return {ok:true,state:next}; }
  function approveDraft(state) {
    if(state.editor.dirty) return {ok:false,reason:'Önce değişiklikleri kaydedin.',state:state};
    if(!state.editor.reviewed) return {ok:false,reason:'Paketin tamamını incelediğinizi işaretleyin.',state:state};
    if(!valid(state.editor.draft)) return {ok:false,reason:'Gerekli içerik, kanıt ve değerlendirme alanlarını doldurun.',state:state};
    if(state.editor.approved && state.editor.approved.revision===state.editor.draftVersion && JSON.stringify(state.editor.approved.package)===JSON.stringify(Object.assign(clone(state.editor.draft),{sourceSnapshot:clone(sourceCatalog[state.editor.draft.evidenceId])}))) return {ok:true,noop:true,state:clone(state)};
    var next=clone(state), e=next.editor;
    e.approved={revision:e.draftVersion,locale:e.locale,package:Object.assign(clone(e.draft),{sourceSnapshot:clone(sourceCatalog[e.draft.evidenceId])})};
    e.approvalHistory.push(clone(e.approved));
    return {ok:true,state:next};
  }
  function publishDraft(state) {
    var e=state.editor, a=e.approved;
    if(e.dirty || !a || a.revision!==e.draftVersion || a.locale!==e.locale || !sourceCatalog[e.draft.evidenceId] || JSON.stringify(a.package)!==JSON.stringify(Object.assign(clone(e.draft),{sourceSnapshot:clone(sourceCatalog[e.draft.evidenceId])}))) return {ok:false,reason:'Yayım için güncel paketin insan onayı gerekli.',state:state};
    if(state.published[e.id].publishedVersion===a.revision) return {ok:true,noop:true,state:clone(state)};
    var next=clone(state), d=clone(a.package), p=next.published[e.id];
    p.title=d.title; p.summary=d.summary; p.body=d.body; p.context=d.context; p.independence=d.corroboration; p.unknowns=d.unknowns.split(';').map(function(x){return x.trim();}).filter(Boolean);
    p.publishedVersion=a.revision; p.claimWording=d.claimWording; p.evidenceId=d.evidenceId; p.evidenceRelation=d.evidenceRelation;
    p.assessments={credibility:d.credibility,corroboration:d.corroboration,completeness:d.completeness,readiness:d.readiness,version:d.assessmentVersion};
    p.sources=[clone(d.sourceSnapshot)]; p.locale=a.locale; p.correctionNote=d.correctionNote.trim();
    p.history.unshift({version:a.revision,note:d.correctionNote.trim() || 'Onaylı yeni sürüm yayımlandı.',reviewedPackage:clone(a)});
    next.editor.publishCount+=1;
    return {ok:true,state:next};
  }
  return {createDemo:initial,reset:initial,saveDraft:saveDraft,setReviewed:setReviewed,approveDraft:approveDraft,publishDraft:publishDraft,getPublished:function(state,id){return state.published[id]?clone(state.published[id]):null;},listPublished:function(state){return stories.map(function(s){return clone(state.published[s.id]);});},sourceSnapshots:clone(Object.keys(sourceCatalog).map(function(id){return sourceCatalog[id];}))};
}));
