<?xml version="1.0" encoding="UTF-8"?>
<!-- ===========================================
     SCAP Data Stream Collection map type module.
    
     Represents a single SCAP Data Stream Collection
    
     Joshua Lubell
    
     ======================================= -->

<!ENTITY % scapComponent  "scapComponent"           >
<!ENTITY % scapDataStream "scapDataStream" >    

<!ENTITY % scapDataStreamCollection.content
                       "((%title;)?, 
                         (%topicmeta;)?,
                         (%scapComponent;)*,                         
                         (%scapDataStream;)+,
                         (%reltable;)*)">
<!ENTITY % scapDataStreamCollection.attributes
              "title
                          CDATA
                                    #IMPLIED
               id
                          ID
                                    #IMPLIED
               %conref-atts;
               anchorref
                          CDATA
                                    #IMPLIED
               outputclass
                          CDATA
                                    #IMPLIED
               %localization-atts;
               %topicref-atts;
               %select-atts;
               "
>
<!ELEMENT  scapDataStreamCollection %scapDataStreamCollection.content;>
<!ATTLIST  scapDataStreamCollection %scapDataStreamCollection.attributes;
                 %arch-atts;
                 domains 
                        CDATA
                                  "(map scapDataStreamCollection mapGroup scapDataStreamDomain)
                                  &included-domains;"
> 

<!ENTITY % scapComponent.content "EMPTY" >
<!ENTITY % scapComponent.attributes "
navtitle
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
                                    #REQUIRED
               keyscope
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
               collection-type
                          (choice |
                           family |
                           sequence |
                           unordered |
                           -dita-use-conref-target)
                                    #IMPLIED
               processing-role
                          (normal |
                           resource-only |
                           -dita-use-conref-target)
                                    'resource-only'
               type
                          CDATA
                                    #IMPLIED
               cascade
                          CDATA
                                    #IMPLIED
               scope
                          (external |
                           local |
                           peer |
                           -dita-use-conref-target)
                                    #IMPLIED
               locktitle
                          (no |
                           yes |
                           -dita-use-conref-target)
                                    #IMPLIED
               format
                          CDATA
                                    #IMPLIED
               linking
                          (none |
                           normal |
                           sourceonly |
                           targetonly |
                           -dita-use-conref-target)
                                    #IMPLIED
               toc
                          (no |
                           yes |
                           -dita-use-conref-target)
                                    #IMPLIED
               print
                          (no |
                           printonly |
                           yes |
                           -dita-use-conref-target)
                                    #IMPLIED
               search
                          (no |
                           yes |
                           -dita-use-conref-target)
                                    #IMPLIED
               chunk
                          CDATA
                                    #IMPLIED
               %univ-atts;
               ">
<!ELEMENT  scapComponent %scapComponent.content; >
<!ATTLIST  scapComponent %scapComponent.attributes;
                 %arch-atts;
                 domains 
                        CDATA
                                  "(map scapDataStreamCollection mapGroup scapDataStreamDomain)
                                  &included-domains;"
>    

<!ATTLIST scapDataStreamCollection    
    %global-atts;  class CDATA "- map/map scapDataStreamCollection/scapDataStreamCollection "        >    
<!ATTLIST scapComponent    
    %global-atts;  class CDATA "- map/topicref mapgroup-d/keydef scapDataStreamCollection/scapComponent "        >    

<!-- ======== End of SCAP Data Stream Collection map type module ======  -->