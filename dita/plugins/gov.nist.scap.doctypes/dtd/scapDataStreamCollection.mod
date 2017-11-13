<?xml version="1.0" encoding="UTF-8"?>
<!-- ===========================================
     SCAP Data Stream Collection map type module.
    
     Represents a single SCAP Data Stream Collection
    
     Joshua Lubell
    
     ======================================= -->

<!ENTITY % keydef           "keydef"           >
<!ENTITY % scapDataStream "scapDataStream" >    

<!ENTITY % scapDataStreamCollection.content
                       "((%title;)?, 
                         (%topicmeta;)?,
                         (%keydef;)*,                         
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
<!ATTLIST scapDataStreamCollection    
    %global-atts;  class CDATA "- map/map scapDataStreamCollection/scapDataStreamCollection "        >    

<!-- ======== End of SCAP Data Stream Collection map type module ======  -->