<?xml version="1.0" encoding="UTF-8"?>
<!-- ==================================
     SCAP Data Stream Map Domain

     Joshua Lubell

     ================================== -->
     
<!ENTITY % scapDataStream "scapDataStream" >
<!ENTITY % scapDictionaries     "scapDictionaries" >
<!ENTITY % scapCpeListRef "scapCpeListRef" >
<!ENTITY % scapExternalLinks "scapExternalLinks" >
<!ENTITY % scapUri "scapUri" >
<!ENTITY % scapChecklists "scapChecklists" >
<!ENTITY % scapBenchmarkRef "scapBenchmarkRef" >
<!ENTITY % scapTailoringRef "scapTailoringRef" >
<!ENTITY % scapChecks "scapChecks" >
<!ENTITY % scapOvalRef "scapOvalRef" >
<!ENTITY % scapOcilRef "scapOcilRef" >

<!ENTITY % scapDataStream.content 
    "((%scapDictionaries;)?,
    (%scapChecklists;)?,
    %scapChecks;)"
    >

<!ENTITY % scapDataStream.attributes
              "navtitle
                          CDATA
                                    #IMPLIED
               href
                          CDATA
                                    #IMPLIED
               keyref
                          CDATA
                                    #IMPLIED
               keys
                          CDATA
                                    #IMPLIED
               query
                          CDATA
                                    #IMPLIED
               copy-to
                          CDATA
                                    #IMPLIED
               outputclass
                          CDATA
                                    #IMPLIED
               %topicref-atts;
               %univ-atts;"
>
<!ELEMENT  scapDataStream %scapDataStream.content;>
<!ATTLIST  scapDataStream %scapDataStream.attributes;>

<!ENTITY % scapDictionaries.content 
    "(%scapCpeListRef;)+"
    >

<!ENTITY % scapDictionaries.attributes
              "navtitle
                          CDATA
                                    #IMPLIED
               href
                          CDATA
                                    #IMPLIED
               keyref
                          CDATA
                                    #IMPLIED
               keys
                          CDATA
                                    #IMPLIED
               query
                          CDATA
                                    #IMPLIED
               copy-to
                          CDATA
                                    #IMPLIED
               outputclass
                          CDATA
                                    #IMPLIED
               %topicref-atts;
               %univ-atts;"
>
<!ELEMENT  scapDictionaries %scapDictionaries.content;>
<!ATTLIST  scapDictionaries %scapDictionaries.attributes;>

<!ENTITY % scapChecklists.content 
    "(%scapBenchmarkRef; | %scapTailoringRef; )+"
    >

<!ENTITY % scapChecklists.attributes
              "navtitle
                          CDATA
                                    #IMPLIED
               href
                          CDATA
                                    #IMPLIED
               keyref
                          CDATA
                                    #IMPLIED
               keys
                          CDATA
                                    #IMPLIED
               query
                          CDATA
                                    #IMPLIED
               copy-to
                          CDATA
                                    #IMPLIED
               outputclass
                          CDATA
                                    #IMPLIED
               %topicref-atts;
               %univ-atts;"
>
<!ELEMENT  scapChecklists %scapChecklists.content;>
<!ATTLIST  scapChecklists %scapChecklists.attributes;>

<!ENTITY % scapChecks.content 
    "(%scapOvalRef; | %scapOcilRef;)+"
    >

<!ENTITY % scapChecks.attributes
              "navtitle
                          CDATA
                                    #IMPLIED
               href
                          CDATA
                                    #IMPLIED
               keyref
                          CDATA
                                    #IMPLIED
               keys
                          CDATA
                                    #IMPLIED
               query
                          CDATA
                                    #IMPLIED
               copy-to
                          CDATA
                                    #IMPLIED
               outputclass
                          CDATA
                                    #IMPLIED
               %topicref-atts;
               %univ-atts;"
>
<!ELEMENT  scapChecks %scapChecks.content;>
<!ATTLIST  scapChecks %scapChecks.attributes;>

<!ENTITY % scapCpeListRef.content 
    "(%scapExternalLinks;)?"
    >

<!ENTITY % scapCpeListRef.attributes
              "navtitle
                          CDATA
                                    #IMPLIED
               href
                          CDATA
                                    #IMPLIED
               keyref
                          CDATA
                                    #IMPLIED
               keys
                          CDATA
                                    #IMPLIED
               query
                          CDATA
                                    #IMPLIED
               copy-to
                          CDATA
                                    #IMPLIED
               outputclass
                          CDATA
                                    #IMPLIED
               %topicref-atts;
               %univ-atts;"
>
<!ELEMENT  scapCpeListRef %scapCpeListRef.content;>
<!ATTLIST  scapCpeListRef %scapCpeListRef.attributes;>

<!ENTITY % scapBenchmarkRef.content 
    "(%scapExternalLinks;)?"
    >

<!ENTITY % scapBenchmarkRef.attributes
              "navtitle
                          CDATA
                                    #IMPLIED
               href
                          CDATA
                                    #IMPLIED
               keyref
                          CDATA
                                    #IMPLIED
               keys
                          CDATA
                                    #IMPLIED
               query
                          CDATA
                                    #IMPLIED
               copy-to
                          CDATA
                                    #IMPLIED
               outputclass
                          CDATA
                                    #IMPLIED
               %topicref-atts;
               %univ-atts;"
>
<!ELEMENT  scapBenchmarkRef %scapBenchmarkRef.content;>
<!ATTLIST  scapBenchmarkRef %scapBenchmarkRef.attributes;>

<!ENTITY % scapTailoringRef.content 
    "(%scapExternalLinks;)?"
    >

<!ENTITY % scapTailoringRef.attributes
              "navtitle
                          CDATA
                                    #IMPLIED
               href
                          CDATA
                                    #IMPLIED
               keyref
                          CDATA
                                    #IMPLIED
               keys
                          CDATA
                                    #IMPLIED
               query
                          CDATA
                                    #IMPLIED
               copy-to
                          CDATA
                                    #IMPLIED
               outputclass
                          CDATA
                                    #IMPLIED
               %topicref-atts;
               %univ-atts;"
>
<!ELEMENT  scapTailoringRef %scapTailoringRef.content;>
<!ATTLIST  scapTailoringRef %scapTailoringRef.attributes;>

<!ENTITY % scapOvalRef.content 
    "(%scapExternalLinks;)?"
    >

<!ENTITY % scapOvalRef.attributes
              "navtitle
                          CDATA
                                    #IMPLIED
               href
                          CDATA
                                    #IMPLIED
               keyref
                          CDATA
                                    #IMPLIED
               keys
                          CDATA
                                    #IMPLIED
               query
                          CDATA
                                    #IMPLIED
               copy-to
                          CDATA
                                    #IMPLIED
               outputclass
                          CDATA
                                    #IMPLIED
               %topicref-atts;
               %univ-atts;"
>
<!ELEMENT  scapOvalRef %scapOvalRef.content;>
<!ATTLIST  scapOvalRef %scapOvalRef.attributes;>

<!ENTITY % scapOcilRef.content 
    "(%scapExternalLinks;)?"
    >

<!ENTITY % scapOcilRef.attributes
              "navtitle
                          CDATA
                                    #IMPLIED
               href
                          CDATA
                                    #IMPLIED
               keyref
                          CDATA
                                    #IMPLIED
               keys
                          CDATA
                                    #IMPLIED
               query
                          CDATA
                                    #IMPLIED
               copy-to
                          CDATA
                                    #IMPLIED
               outputclass
                          CDATA
                                    #IMPLIED
               %topicref-atts;
               %univ-atts;"
>
<!ELEMENT  scapOcilRef %scapOcilRef.content;>
<!ATTLIST  scapOcilRef %scapOcilRef.attributes;>

<!ENTITY % scapExternalLinks.content 
    "(%scapUri;)+"
    >

<!ENTITY % scapExternalLinks.attributes
              "navtitle
                          CDATA
                                    #IMPLIED
               href
                          CDATA
                                    #IMPLIED
               keyref
                          CDATA
                                    #IMPLIED
               keys
                          CDATA
                                    #IMPLIED
               query
                          CDATA
                                    #IMPLIED
               copy-to
                          CDATA
                                    #IMPLIED
               outputclass
                          CDATA
                                    #IMPLIED
               %topicref-atts;
               %univ-atts;"
>
<!ELEMENT  scapExternalLinks %scapExternalLinks.content;>
<!ATTLIST  scapExternalLinks %scapExternalLinks.attributes;>

<!ENTITY % scapUri.content 
    "EMPTY"
    >

<!ENTITY % scapUri.attributes
              "navtitle
                          CDATA
                                    #IMPLIED
               href
                          CDATA
                                    #IMPLIED
               keyref
                          CDATA
                                    #IMPLIED
               keys
                          CDATA
                                    #IMPLIED
               query
                          CDATA
                                    #IMPLIED
               copy-to
                          CDATA
                                    #IMPLIED
               outputclass
                          CDATA
                                    #IMPLIED
               %topicref-atts;
               %univ-atts;"
>
<!ELEMENT  scapUri %scapUri.content;>
<!ATTLIST  scapUri %scapUri.attributes;>

<!ATTLIST  scapDataStream     %global-atts;  class CDATA "- map/topicref scapDataStream-d/scapDataStream "     >
<!ATTLIST  scapDictionaries     %global-atts;  class CDATA "- map/topicref scapDataStream-d/scapDictionaries "     >
<!ATTLIST  scapCpeListRef     %global-atts;  class CDATA "- map/topicref scapDataStream-d/scapCpeListRef "     >
<!ATTLIST  scapExternalLinks     %global-atts;  class CDATA "- map/topicref scapDataStream-d/scapExternalLinks "     >
<!ATTLIST  scapUri     %global-atts;  class CDATA "- map/topicref scapDataStream-d/scapUri "     >
<!ATTLIST  scapChecklists     %global-atts;  class CDATA "- map/topicref scapDataStream-d/scapChecklists "     >
<!ATTLIST  scapBenchmarkRef     %global-atts;  class CDATA "- map/topicref scapDataStream-d/scapBenchmarkRef "     >
<!ATTLIST  scapTailoringRef     %global-atts;  class CDATA "- map/topicref scapDataStream-d/scapTailoringRef "     >
<!ATTLIST  scapChecks     %global-atts;  class CDATA "- map/topicref scapDataStream-d/scapChecks "     >
<!ATTLIST  scapOvalRef     %global-atts;  class CDATA "- map/topicref scapDataStream-d/scapOvalRef "     >
<!ATTLIST  scapOcilRef     %global-atts;  class CDATA "- map/topicref scapDataStream-d/scapOcilRef "     >
